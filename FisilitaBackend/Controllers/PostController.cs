using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using FisilitaBackend.Models;

namespace FisilitaBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PostController : ControllerBase
    {
        private readonly IMongoCollection<Post> _postsCollection;
        private readonly IMongoCollection<UserAction> _actionsCollection; // Engelleme ve spamları tutacak koleksiyon

        public PostController()
        {
            var mongoClient = new MongoClient("mongodb://localhost:27017");
            var database = mongoClient.GetDatabase("FisiltiDB");
            _postsCollection = database.GetCollection<Post>("Posts");
            _actionsCollection = database.GetCollection<UserAction>("UserActions");
        }

        // 1. YENİ GÖNDERİ PAYLAŞMA
        [HttpPost("create")]
        public async Task<IActionResult> CreatePost([FromBody] PostCreateRequest request)
        {
            try
            {
                var newPost = new Post
                {
                    Username = request.Username,
                    Content = request.Content,
                    BackgroundColor = request.BackgroundColor
                };

                await _postsCollection.InsertOneAsync(newPost);
                return Ok(new { Mesaj = "Fısıltın başarıyla paylaşıldı!", PostId = newPost.Id });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Hata = $"Gönderi paylaşılamadı: {ex.Message}" });
            }
        }

        // 2. TÜM GÖNDERİLERİ LİSTELEME (ENGELLEME FİLTRELİ)
        // İstek atan kullanıcının adını parametre olarak alıyoruz ki engellediklerini gizleyelim
        [HttpGet("all")]
        public async Task<IActionResult> GetPosts([FromQuery] string currentUsername)
        {
            try
            {
                // Kullanıcının daha önce "ENGELLE" dediği tüm gönderi ID'lerini buluyoruz
                var blockedPostIds = await _actionsCollection
                    .Find(a => a.Username == currentUsername && a.ActionType == "ENGELLE")
                    .Project(a => a.PostId)
                    .ToListAsync();

                // Tüm gönderileri çekiyoruz ancak kullanıcının engellediği ID'leri dışarıda bırakıyoruz (Filter)
                var posts = await _postsCollection
                    .Find(p => !blockedPostIds.Contains(p.Id))
                    .SortByDescending(p => p.CreatedAt)
                    .ToListAsync();

                return Ok(posts);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Hata = $"Gönderiler getirilemedi: {ex.Message}" });
            }
        }

        // 3. ÜÇ NOKTA AKSİYONLARI (ENGELLE, SPAM, ŞİKAYET)
        [HttpPost("report-action")]
        public async Task<IActionResult> ReportAction([FromBody] ReportRequest request)
        {
            try
            {
                // Aynı kullanıcının aynı gönderiye mükerrer işlem yapmasını engellemek için kontrol
                var existingAction = await _actionsCollection
                    .Find(a => a.PostId == request.PostId && a.Username == request.Username && a.ActionType == request.ActionType)
                    .FirstOrDefaultAsync();

                if (existingAction != null)
                {
                    return Ok(new { Mesaj = $"Bu gönderi için zaten {request.ActionType} bildiriminde bulunmuşsunuz." });
                }

                // Yeni aksiyonu kaydediyoruz
                var newAction = new UserAction
                {
                    PostId = request.PostId,
                    Username = request.Username,
                    ActionType = request.ActionType.ToUpper() // ENGELLE veya SPAM olarak veritabanına büyük harfle kaydeder
                };

                await _actionsCollection.InsertOneAsync(newAction);

                string donusMesaji = request.ActionType.ToUpper() == "ENGELLE"
                    ? "Gönderi akışınızdan kaldırıldı."
                    : "Bildiriminiz admine iletilmek üzere kaydedildi (Spam).";

                return Ok(new { Mesaj = donusMesaji });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Hata = $"İşlem başarısız oldu: {ex.Message}" });
            }
        }
    }
}
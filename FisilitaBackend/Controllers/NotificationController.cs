using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using FisilitaBackend.Models;

namespace FisilitaBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotificationController : ControllerBase
    {
        private readonly IMongoCollection<Notification> _notificationsCollection;
        private readonly IMongoCollection<User> _usersCollection;

        public NotificationController(IMongoClient mongoClient)
        {
            var database = mongoClient.GetDatabase("FisiltiDB");
            _notificationsCollection = database.GetCollection<Notification>("Notifications");
            _usersCollection = database.GetCollection<User>("Users");
        }

        // 1. KULLANICININ BİLDİRİMLERİNİ GETİR
        [HttpGet("{username}")]
        public async Task<IActionResult> GetNotifications(string username)
        {
            // Önce kullanıcının ayarlarından bildirimleri açıp kapatmadığına bakıyoruz
            var user = await _usersCollection.Find(u => u.Username == username).FirstOrDefaultAsync();
            if (user == null)
            {
                return NotFound(new { message = "Kullanıcı bulunamadı." });
            }

            // Eğer ayarlardan bildirimleri "KAPAT" yaptıysa, boş liste dönüyoruz
            if (!user.AllowNotifications)
            {
                return Ok(new List<Notification>());
            }

            // Bildirimleri en yeniden en eskiye doğru sıralayıp getiriyoruz
            var notifications = await _notificationsCollection
                .Find(n => n.TargetUsername == username)
                .SortByDescending(n => n.CreatedAt)
                .ToListAsync();

            return Ok(notifications);
        }

        // 2. TÜM BİLDİRİMLERİ OKUNDU OLARAK İŞARETLE (Pencere açılınca veya kapanınca tetiklenebilir)
        [HttpPut("{username}/read-all")]
        public async Task<IActionResult> MarkAllAsRead(string username)
        {
            var update = Builders<Notification>.Update.Set(n => n.IsRead, true);
            await _notificationsCollection.UpdateManyAsync(n => n.TargetUsername == username && !n.IsRead, update);

            return Ok(new { message = "Tüm bildirimler okundu olarak işaretlendi." });
        }
    }
}
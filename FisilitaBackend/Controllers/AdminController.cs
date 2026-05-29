using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using FisilitaBackend.Models;

namespace FisilitaBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly IMongoCollection<User> _usersCollection;
        private readonly IMongoCollection<Post> _postsCollection;
        private readonly IMongoCollection<UserAction> _actionsCollection;

        public AdminController(IMongoClient mongoClient)
        {
            var database = mongoClient.GetDatabase("FisiltiDB");
            _usersCollection = database.GetCollection<User>("Users");
            _postsCollection = database.GetCollection<Post>("Posts");
            _actionsCollection = database.GetCollection<UserAction>("UserActions");
        }

        // ==========================================
        // 1. DASHBOARD SEKLESİ (İstatistikler)
        // ==========================================
        [HttpGet("dashboard-stats")]
        public async Task<IActionResult> GetDashboardStats()
        {
            var totalUsers = await _usersCollection.CountDocumentsAsync(_ => true);
            var totalPosts = await _postsCollection.CountDocumentsAsync(_ => true);
            var totalReports = await _actionsCollection.CountDocumentsAsync(a => a.ActionType == "Spam");

            // Mock grafik verileri (Buse'nin barlarla gösterdiği günler ve aylar için)
            var dailyActiveUsers = new List<int> { 12, 19, 7, 15, 22, 30, 25 }; // Pzt - Paz
            var monthlyPostCounts = new List<int> { 40, 55, 32, 70, 90 }; // Ocak - Mayıs

            return Ok(new
            {
                totalUsers,
                totalPosts,
                totalReports,
                dailyActiveUsers,
                monthlyPostCounts
            });
        }

        // ==========================================
        // 2. RAPORLAR SEKLESİ (Şikayet Yönetimi)
        // ==========================================
        [HttpGet("reports")]
        public async Task<IActionResult> GetReports()
        {
            // ActionType'ı "Spam" olan eylemleri çekiyoruz
            var reports = await _actionsCollection.Find(a => a.ActionType == "Spam").ToListAsync();
            return Ok(reports);
        }

        [HttpPost("reports/{actionId}/resolve")]
        public async Task<IActionResult> ResolveReport(string actionId, [FromQuery] string decision)
        {
            // decision: "yoksay", "yayindabirak", "sil"
            if (decision == "sil")
            {
                var report = await _actionsCollection.Find(a => a.Id == actionId).FirstOrDefaultAsync();
                if (report != null && !string.IsNullOrEmpty(report.PostId))
                {
                    // Şikayet edilen gönderiyi sistemden tamamen siliyoruz
                    await _postsCollection.DeleteOneAsync(p => p.Id == report.PostId);
                }
            }

            // İnceleme bittiği için rapor kaydını siliyoruz veya durumunu güncelliyoruz
            await _actionsCollection.DeleteOneAsync(a => a.Id == actionId);
            return Ok(new { message = $"Rapor '{decision}' kararıyla sonuçlandırıldı." });
        }

        // ==========================================
        // 3. KULLANICI YÖNETİMİ SEKLESİ
        // ==========================================
        [HttpGet("users")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _usersCollection.Find(_ => true).ToListAsync();
            return Ok(users);
        }

        [HttpPut("users/{username}/toggle-block")]
        public async Task<IActionResult> ToggleBlockUser(string username)
        {
            var user = await _usersCollection.Find(u => u.Username == username).FirstOrDefaultAsync();
            if (user == null) return NotFound("Kullanıcı bulunamadı.");

            // Modelimizde IsActive veya Status alanı varsa onu tersine çeviriyoruz
            // Örn: Projede durum kontrolü için Buse "engelli" veya "aktif" basmış.
            // Biz burada kullanıcının durumunu simüle edelim veya db'ye field ekleyelim:
            var update = Builders<User>.Update.Set("Status", user.BioColor == "engelli" ? "aktif" : "engelli");
            await _usersCollection.UpdateOneAsync(u => u.Username == username, update);

            return Ok(new { message = "Kullanıcı durumu güncellendi." });
        }

        [HttpDelete("users/{username}")]
        public async Task<IActionResult> DeleteUser(string username)
        {
            await _usersCollection.DeleteOneAsync(u => u.Username == username);
            // Kullanıcı silindiğinde postlarını da temizleyelim
            await _postsCollection.DeleteManyAsync(p => p.Username == username);
            return Ok(new { message = "Kullanıcı ve tüm verileri sistemden silindi." });
        }

        // ==========================================
        // 4. GÖNDERİ YÖNETİMİ SEKLESİ
        // ==========================================
        [HttpGet("posts")]
        public async Task<IActionResult> GetAllPosts()
        {
            var posts = await _postsCollection.Find(_ => true).ToListAsync();
            return Ok(posts);
        }

        [HttpDelete("posts/{id}")]
        public async Task<IActionResult> DeletePost(string id)
        {
            await _postsCollection.DeleteOneAsync(p => p.Id == id);
            return Ok(new { message = "Gönderi kaldırıldı." });
        }
    }
}
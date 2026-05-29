using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using FisilitaBackend.Models;
using System.Security.Cryptography;
using System.Text;

namespace FisilitaBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SettingsController : ControllerBase
    {
        private readonly IMongoCollection<User> _usersCollection;

        public SettingsController(IMongoClient mongoClient)
        {
            var database = mongoClient.GetDatabase("FisiltiDB");
            _usersCollection = database.GetCollection<User>("Users");
        }

        // 1. HESAP BİLGİLERİNİ GETİR (Hesap Bilgileri ve Düzenle ekranlarını besler)
        [HttpGet("{currentUsername}")]
        public async Task<IActionResult> GetAccountSettings(string currentUsername)
        {
            var user = await _usersCollection.Find(u => u.Username == currentUsername).FirstOrDefaultAsync();
            if (user == null)
            {
                return NotFound(new { message = "Kullanıcı bulunamadı." });
            }

            return Ok(new
            {
                user.Username,
                user.Email,
                user.AllowNotifications,
                JoinedDate = user.JoinedDate.ToString("dd/MM/yyyy") // Ekrandaki gg/aa/yyyy formatı için
            });
        }

        // 2. KULLANICI ADI VE E-POSTA DÜZENLE (Bilgileri Düzenle sekmesi)
        [HttpPut("{currentUsername}/update-account")]
        public async Task<IActionResult> UpdateAccountDetails(string currentUsername, [FromBody] UpdateAccountDetailsRequest request)
        {
            var user = await _usersCollection.Find(u => u.Username == currentUsername).FirstOrDefaultAsync();
            if (user == null)
            {
                return NotFound(new { message = "Kullanıcı bulunamadı." });
            }

            // Eğer kullanıcı adını değiştiriyorsa, başkası almış mı kontrolü
            if (currentUsername != request.Username)
            {
                var usernameExists = await _usersCollection.Find(u => u.Username == request.Username).AnyAsync();
                if (usernameExists)
                {
                    return BadRequest(new { message = "Bu kullanıcı adı zaten alınmış." });
                }
            }

            // E-posta değiştiriyorsa benzersizlik kontrolü
            if (user.Email != request.Email)
            {
                var emailExists = await _usersCollection.Find(u => u.Email == request.Email).AnyAsync();
                if (emailExists)
                {
                    return BadRequest(new { message = "Bu e-posta adresi zaten kullanımda." });
                }
            }

            var update = Builders<User>.Update
                .Set(u => u.Username, request.Username)
                .Set(u => u.Email, request.Email);

            await _usersCollection.UpdateOneAsync(u => u.Username == currentUsername, update);

            return Ok(new { message = "Hesap bilgileri başarıyla güncellendi!", newUsername = request.Username });
        }

        // 3. ŞİFRE DEĞİŞTİR (Şifre Değiştir sekmesi)
        [HttpPut("{currentUsername}/change-password")]
        public async Task<IActionResult> ChangePassword(string currentUsername, [FromBody] ChangePasswordRequest request)
        {
            if (request.NewPassword != request.ConfirmNewPassword)
            {
                return BadRequest(new { message = "Yeni şifreler uyuşmuyor." }); // Şifre tekrar kontrolü
            }

            var user = await _usersCollection.Find(u => u.Username == currentUsername).FirstOrDefaultAsync();
            if (user == null)
            {
                return NotFound(new { message = "Kullanıcı bulunamadı." });
            }

            // Gelen eski şifreyi hashleyip veritabanındakiyle uyuşuyor mu diye bakıyoruz
            string oldPasswordHash = HashPassword(request.OldPassword);
            if (user.PasswordHash != oldPasswordHash)
            {
                return BadRequest(new { message = "Mevcut şifreniz hatalı." });
            }

            // Her şey doğruysa yeni şifreyi hashleyip kaydediyoruz
            var update = Builders<User>.Update.Set(u => u.PasswordHash, HashPassword(request.NewPassword));
            await _usersCollection.UpdateOneAsync(u => u.Username == currentUsername, update);

            return Ok(new { message = "Şifreniz başarıyla değiştirildi!" });
        }

        // 4. BİLDİRİM AYARI GÜNCELLE (Bildirimler sekmesi)
        [HttpPut("{currentUsername}/toggle-notifications")]
        public async Task<IActionResult> ToggleNotifications(string currentUsername, [FromQuery] bool allow)
        {
            var user = await _usersCollection.Find(u => u.Username == currentUsername).FirstOrDefaultAsync();
            if (user == null)
            {
                return NotFound(new { message = "Kullanıcı bulunamadı." });
            }

            var update = Builders<User>.Update.Set(u => u.AllowNotifications, allow);
            await _usersCollection.UpdateOneAsync(u => u.Username == currentUsername, update);

            return Ok(new { message = $"Bildirim ayarı güncellendi. Durum: {(allow ? "Açık" : "Kapalı")}" });
        }

        // 5. HESAPTAN ÇIKIŞ YAP (Çıkış butonu için)
        [HttpPost("{currentUsername}/logout")]
        public async Task<IActionResult> Logout(string currentUsername)
        {
            return Ok(new { message = "Başarıyla çıkış yapıldı. Oturum sonlandırıldı." });
        }

        // Şifre şifreleme yardımcı fonksiyonumuz (Auth ve Register sistemindekiyle birebir aynı olmalı)
        private string HashPassword(string password)
        {
            using (SHA256 sha256Hash = SHA256.Create())
            {
                byte[] bytes = sha256Hash.ComputeHash(Encoding.UTF8.GetBytes(password));
                StringBuilder builder = new StringBuilder();
                for (int i = 0; i < bytes.Length; i++)
                {
                    builder.Append(bytes[i].ToString("x2"));
                }
                return builder.ToString();
            }
        }
    }
}
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using FisilitaBackend.Models;
using System.Security.Cryptography;
using System.Text;

namespace FisilitaBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IMongoCollection<User> _usersCollection;

        public AuthController()
        {
            var mongoClient = new MongoClient("mongodb://localhost:27017");
            var database = mongoClient.GetDatabase("FisiltiDB");
            _usersCollection = database.GetCollection<User>("Users");
        }

        // 1. KAYIT OLMA FONKSİYONU
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            try
            {
                var existingUser = await _usersCollection.Find(u => u.Email == request.Email).FirstOrDefaultAsync();
                if (existingUser != null)
                {
                    return BadRequest(new { Mesaj = "Bu e-posta adresi zaten kullanımda." });
                }

                string hashedWithSha256 = HashPassword(request.Password);

                var newUser = new User
                {
                    Username = request.Username,
                    Email = request.Email,
                    PasswordHash = hashedWithSha256
                };

                await _usersCollection.InsertOneAsync(newUser);
                return Ok(new { Mesaj = "Kullanıcı MongoDB'ye başarıyla kaydedildi!", KullaniciAdi = newUser.Username });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Hata = $"Kayıt esnasında bir hata oluştu: {ex.Message}" });
            }
        }

        // 2. GİRİŞ YAPMA FONKSİYONU
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            try
            {
                // Veritabanında bu maile sahip kullanıcıyı arıyoruz
                var user = await _usersCollection.Find(u => u.Email == request.Email).FirstOrDefaultAsync();

                // Kullanıcı yoksa hata dönüyoruz
                if (user == null)
                {
                    return Unauthorized(new { Mesaj = "E-posta veya şifre hatalı." });
                }

                // Gelen şifreyi de hash'leyip veritabanındakiyle karşılaştırıyoruz
                string incomingPasswordHash = HashPassword(request.Password);
                if (user.PasswordHash != incomingPasswordHash)
                {
                    return Unauthorized(new { Mesaj = "E-posta veya şifre hatalı." });
                }
                else {
                    // Her şey doğruysa giriş başarılı mesajı, kullanıcı bilgileri ve Rolü dönüyoruz
                    return Ok(new
                    {
                        Mesaj = "Giriş başarılı!",
                        KullaniciAdi = user.Username,
                        Eposta = user.Email,
                        Rol = user.Role // Buse'nin Admin paneline yönlendirme yapabilmesi için kritik alan!
                    });
                }

                
            }
            catch (Exception ex)
            {
                return BadRequest(new { Hata = $"Giriş esnasında bir hata oluştu: {ex.Message}" });
            }
        }

        // Şifre Hashleme Fonksiyonu
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
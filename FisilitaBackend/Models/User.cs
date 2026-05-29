using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace FisilitaBackend.Models
{
    public class User
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        public string Username { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string PasswordHash { get; set; } = null!;

       
        public string Name { get; set; } = ""; // Profildeki görünen Ad
        public string Bio { get; set; } = "";  // Biyografi yazısı
        public string BioColor { get; set; } = "#00FF00"; // Seçtiği renk (Hex kodu veya sınıf adı)
        public string ProfilePicture { get; set; } = ""; // Profil resmi URL'i

        public int PostCount { get; set; } = 0;      // Gönderi Sayısı
        public int FollowerCount { get; set; } = 0;  // Takipçi Sayısı (Tasarımda 50 görünüyor test için)
        public int FollowingCount { get; set; } = 0; // Takip Edilen Sayısı

        public bool AllowNotifications { get; set; } = true; // Varsayılan olarak bildirimler açık olsun

        public string Role { get; set; } = "User"; // Kullanıcı rolü (Varsayılan: User, Panel için: Admin)
        public DateTime JoinedDate { get; set; } = DateTime.UtcNow; // Katılma Tarihi
    }
}
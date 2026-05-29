using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace FisilitaBackend.Models
{
    public class Notification
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        public string TargetUsername { get; set; } = null!; // Bildirimi alacak olan kişi (Örn: Buse)

        public string Message { get; set; } = null!; // Ekranda yazacak metin (Örn: "Birisi seni takip etti")

        public string Type { get; set; } = null!; // "Follow", "Post", "Trend" (İkonları frontendde ayırt etmek için)

        public bool IsRead { get; set; } = false; // Okundu/Okunmadı bilgisi

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
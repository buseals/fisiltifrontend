using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace FisilitaBackend.Models
{
    public class Post
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("username")]
        public string Username { get; set; } = null!;

        [BsonElement("content")]
        public string Content { get; set; } = null!;

        [BsonElement("backgroundColor")]
        public string BackgroundColor { get; set; } = null!; // Hex kodu veya renk adı tutacağız

        [BsonElement("createdAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
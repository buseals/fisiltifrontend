using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace FisilitaBackend.Models
{
    public class UserAction
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("postId")]
        public string PostId { get; set; } = null!;

        [BsonElement("username")]
        public string Username { get; set; } = null!;
        
        [BsonElement("targetUsername")]
        public string? TargetUsername { get; set; } // Takip edilen veya engellenen kişi (Takipte PostId boş kalacak)
        
        [BsonElement("actionType")]
        public string ActionType { get; set; } = null!; // ENGELLE, SPAM

        [BsonElement("createdAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;



    }
}
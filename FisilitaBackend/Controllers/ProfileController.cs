using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using FisilitaBackend.Models;

namespace FisilitaBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProfileController : ControllerBase
    {
        private readonly IMongoCollection<User> _usersCollection;
        private readonly IMongoCollection<UserAction> _actionsCollection;

        public ProfileController(IMongoClient mongoClient)
        {
            var database = mongoClient.GetDatabase("FisiltiDB");
            _usersCollection = database.GetCollection<User>("Users");
            _actionsCollection = database.GetCollection<UserAction>("UserActions");
        }

        // 1. KULLANICI PROFİLİNİ GETİRME ENDPOINT'I
        [HttpGet("{username}")]
        public async Task<IActionResult> GetProfile(string username)
        {
            var user = await _usersCollection.Find(u => u.Username == username).FirstOrDefaultAsync();

            if (user == null)
            {
                return NotFound(new { message = "Kullanıcı bulunamadı." });
            }

            return Ok(new
            {
                user.Id,
                user.Username,
                user.Name,
                user.Bio,
                user.BioColor,
                user.ProfilePicture,
                user.PostCount,
                user.FollowerCount,
                user.FollowingCount,
                JoinedDate = user.JoinedDate.ToString("dd/MM/yyyy") //tasarımdaki format
            });
        }

        // 2. PROFİL BİLGİLERİNİ GÜNCELLEME ENDPOINT'I
        [HttpPut("{username}/update")]
        public async Task<IActionResult> UpdateProfile(string username, [FromBody] ProfileUpdateRequest request)
        {
            var user = await _usersCollection.Find(u => u.Username == username).FirstOrDefaultAsync();

            if (user == null)
            {
                return NotFound(new { message = "Kullanıcı bulunamadı." });
            }

            var update = Builders<User>.Update
                .Set(u => u.Name, request.Name)
                .Set(u => u.Bio, request.Bio)
                .Set(u => u.BioColor, request.BioColor)
                .Set(u => u.ProfilePicture, request.ProfilePicture);

            await _usersCollection.UpdateOneAsync(u => u.Username == username, update);

            return Ok(new { message = "Profil başarıyla güncellendi!" });
        }

        // 3. TAKİP ETME ENDPOINT'I
        [HttpPost("{username}/follow")]
        public async Task<IActionResult> FollowUser(string username, [FromQuery] string targetUsername)
        {
            if (username == targetUsername)
            {
                return BadRequest(new { message = "Kendinizi takip edemezsiniz." });
            }

            var sourceUser = await _usersCollection.Find(u => u.Username == username).FirstOrDefaultAsync();
            var targetUser = await _usersCollection.Find(u => u.Username == targetUsername).FirstOrDefaultAsync();

            if (sourceUser == null || targetUser == null)
            {
                return NotFound(new { message = "Kullanıcı bulunamadı." });
            }

            // Zaten takip ediyor mu kontrolü 
            var alreadyFollowing = await _actionsCollection
                .Find(a => a.Username == username && a.TargetUsername == targetUsername && a.ActionType == "Follow")
                .AnyAsync();

            if (alreadyFollowing)
            {
                return BadRequest(new { message = "Bu kullanıcıyı zaten takip ediyorsunuz." });
            }

            // 1. İlişkiyi ortak yapıyla UserActions tablosuna kaydet
            var followAction = new UserAction
            {
                Username = username,          // Eylemi yapan kişi (Takip eden)
                TargetUsername = targetUsername,  // Eyleme maruz kalan kişi (Takip edilen)
                ActionType = "Follow"
            };
            await _actionsCollection.InsertOneAsync(followAction);

            // 2. Takip eden kişinin "Takip Edilen" (Following) sayısını 1 artır
            var updateSource = Builders<User>.Update.Inc(u => u.FollowingCount, 1);
            await _usersCollection.UpdateOneAsync(u => u.Username == username, updateSource);

            // 3. Takip edilen kişinin "Takipçi" (Follower) sayısını 1 artır
            var updateTarget = Builders<User>.Update.Inc(u => u.FollowerCount, 1);
            await _usersCollection.UpdateOneAsync(u => u.Username == targetUsername, updateTarget);

            return Ok(new { message = $"{targetUsername} başarıyla takip edildi!" });
        }

        // 4. TAKİPTEN ÇIKMA ENDPOINT'I
        [HttpPost("{username}/unfollow")]
        public async Task<IActionResult> UnfollowUser(string username, [FromQuery] string targetUsername)
        {
            var sourceUser = await _usersCollection.Find(u => u.Username == username).FirstOrDefaultAsync();
            var targetUser = await _usersCollection.Find(u => u.Username == targetUsername).FirstOrDefaultAsync();

            if (sourceUser == null || targetUser == null)
            {
                return NotFound(new { message = "Kullanıcı bulunamadı." });
            }

            // Takip ilişkisini bul ve sil 
            var deleteResult = await _actionsCollection.DeleteOneAsync(a =>
                a.Username == username &&
                a.TargetUsername == targetUsername &&
                a.ActionType == "Follow");

            if (deleteResult.DeletedCount == 0)
            {
                return BadRequest(new { message = "Zaten bu kullanıcıyı takip etmiyorsunuz." });
            }

            // Takip bırakanın "Takip Edilen" sayısını 1 azalt
            var updateSource = Builders<User>.Update.Inc(u => u.FollowingCount, -1);
            await _usersCollection.UpdateOneAsync(u => u.Username == username, updateSource);

            // Takip bırakılanın "Takipçi" sayısını 1 azalt
            var updateTarget = Builders<User>.Update.Inc(u => u.FollowerCount, -1);
            await _usersCollection.UpdateOneAsync(u => u.Username == targetUsername, updateTarget);

            return Ok(new { message = "Takip başarıyla bırakıldı." });
        }
    }
}
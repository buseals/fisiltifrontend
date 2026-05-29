namespace FisilitaBackend.Models
{
    public class PostCreateRequest
    {
        public string Username { get; set; } = null!;
        public string Content { get; set; } = null!;
        public string BackgroundColor { get; set; } = null!;
    }
}
namespace FisilitaBackend.Models
{
    public class ProfileUpdateRequest
    {
        public string Name { get; set; } = null!;
        public string Bio { get; set; } = null!;
        public string BioColor { get; set; } = null!;
        public string ProfilePicture { get; set; } = "";
    }
}
namespace FisilitaBackend.Models
{
    public class ReportRequest
    {
        public string PostId { get; set; } = null!; // İşlem yapılan gönderinin ID'si
        public string Username { get; set; } = null!; // Bu işlemi yapan (engelleyen/şikayet eden) kullanıcı
        public string ActionType { get; set; } = null!; // "ENGELLE" veya "SPAM" veya "SIKAYET" olacak
    }
}

using System;

namespace Application.Profiles.DTOs;

public class PhotoUploadResults
{
    public required string PublicId { get; set; }
    public required string Url { get; set; }
}

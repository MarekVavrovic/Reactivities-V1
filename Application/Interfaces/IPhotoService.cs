using System;
using Application.Profiles.DTOs;
using Microsoft.AspNetCore.Http;

namespace Application.Interfaces;

public interface IPhotoService
{
    Task<PhotoUploadResults?> UploadPhoto(IFormFile file);
    Task<string> DeletePhoto(string publicId);
    
}

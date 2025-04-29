// ----------------------------------------------------------------------------
// Developer:      Ismail Hamzah
// Email:         go2ismail@gmail.com
// ----------------------------------------------------------------------------

using Application.Services.Externals;
using Application.Services.Repositories;
using Domain.Entities;
using Microsoft.Extensions.Options;

namespace Infrastructure.ImageManagers;

public class ImageService : IImageService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly string _folderPath;
    private readonly int _maxFileSizeInBytes;
    private readonly IBaseCommandRepository<FileImage> _imgRepository;

    public ImageService(
        IUnitOfWork unitOfWork,
        IOptions<ImageManagerSettings> settings,
        IBaseCommandRepository<FileImage> imgRepository)
    {
        _unitOfWork = unitOfWork;
        _folderPath = Path.Combine(Directory.GetCurrentDirectory(), settings.Value.PathFolder);
        _maxFileSizeInBytes = settings.Value.MaxFileSizeInMB * 1024 * 1024;
        _imgRepository = imgRepository;
    }

    public async Task<string> UploadAsync(
        string? userId,
        string originalFileName,
        string imgExtension,
        byte[] fileData,
        long size,
        CancellationToken cancellationToken = default)
    {

        if (string.IsNullOrWhiteSpace(imgExtension) || imgExtension.Contains(Path.DirectorySeparatorChar) || imgExtension.Contains(Path.AltDirectorySeparatorChar))
        {
            throw new ImageManagerException($"Invalid file extension: {nameof(imgExtension)}");
        }

        if (fileData == null || fileData.Length == 0)
        {
            throw new ImageManagerException($"File data cannot be null or empty: {nameof(fileData)}");
        }

        if (fileData.Length > _maxFileSizeInBytes)
        {
            throw new ImageManagerException($"File size exceeds the maximum allowed size of {_maxFileSizeInBytes / (1024 * 1024)} MB");
        }

        var fileName = $"{Guid.NewGuid():N}.{imgExtension}";

        if (!Directory.Exists(_folderPath))
        {
            Directory.CreateDirectory(_folderPath);
        }

        var filePath = Path.Combine(_folderPath, fileName);

        await File.WriteAllBytesAsync(filePath, fileData, cancellationToken);

        var img = new FileImage(
            userId,
            fileName,
            null,
            originalFileName,
            fileName,
            imgExtension,
            size);

        await _imgRepository.CreateAsync(img, cancellationToken);
        await _unitOfWork.SaveAsync(cancellationToken);


        return fileName;
    }

    public async Task<byte[]> GetFileAsync(string fileName, CancellationToken cancellationToken = default)
    {
        var filePath = Path.Combine(_folderPath, fileName);

        if (!File.Exists(filePath))
        {
            filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "noimage.png");
        }

        var result = await File.ReadAllBytesAsync(filePath, cancellationToken);

        return result;
    }

}

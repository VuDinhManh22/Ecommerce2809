// ----------------------------------------------------------------------------
// Developer:      Ismail Hamzah
// Email:         go2ismail@gmail.com
// ----------------------------------------------------------------------------

namespace Application.Common.Models;

public class PagedList<T>
{
    public List<T> Items { get; }
    public int TotalRecords { get; }
    public int Page { get; }
    public int Limit { get; }
    public int TotalPages => (int)Math.Ceiling(TotalRecords / (double)Limit);
    public int Count => Items.Count;
    public bool HasNext => Page < TotalPages;
    public bool HasPrev => Page > 1;

    public int[] Pages
    {
        get
        {
            var pages = new List<int>();

            // Menampilkan semua halaman tanpa gap
            if (TotalPages <= 10)
            {
                for (int i = 1; i <= TotalPages; i++)
                {
                    pages.Add(i);
                }
            }
            else
            {
                // Menampilkan halaman secara lebih dekat dengan halaman saat ini
                pages.Add(1); // Halaman pertama

                int start = Math.Max(2, Page - 2); // Mulai dari halaman 2 atau lebih dekat
                int end = Math.Min(Page + 2, TotalPages); // Akhiri di halaman terakhir atau lebih dekat

                for (int i = start; i <= end; i++)
                {
                    pages.Add(i);
                }

                pages.Add(TotalPages); // Tambahkan halaman terakhir
            }

            return pages.Distinct().ToArray(); // Menghapus duplikat sebelum mengembalikan array
        }
    }

    public PagedList(List<T> items, int totalRecords, int page = 1, int limit = 10)
    {
        if (page < 1)
        {
            throw new ApplicationException("Page minimum value is 1.");
        }

        if (limit < 1)
        {
            throw new ApplicationException("Limit minimum value is 1.");
        }

        Items = items;
        TotalRecords = totalRecords;
        Page = page;
        Limit = limit;
    }

    public static PagedList<T> FromList(List<T> source, int page = 1, int limit = 10)
    {
        if (page < 1)
        {
            throw new ApplicationException("Page minimum value is 1.");
        }

        if (limit < 1)
        {
            throw new ApplicationException("Limit minimum value is 1.");
        }

        var pagedItems = source
            .Skip((page - 1) * limit)
            .Take(limit)
            .ToList();

        return new PagedList<T>(pagedItems, source.Count, page, limit);
    }
}

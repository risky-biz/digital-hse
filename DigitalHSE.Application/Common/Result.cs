namespace DigitalHSE.Application.Common;

public class Result
{
    public bool Success { get; private set; }
    public string Error { get; private set; } = string.Empty;
    public List<string> Errors { get; private set; } = new();
    public int StatusCode { get; private set; } = 200;
    public bool IsSuccess => Success;
    public List<string> ErrorMessages => Errors;

    protected Result() { }

    public void OK()
    {
        Success = true;
        Error = string.Empty;
        Errors.Clear();
        StatusCode = 200;
    }

    public void BadRequest(string error)
    {
        Success = false;
        Error = error;
        Errors.Add(error);
        StatusCode = 400;
    }

    public void Unauthorized(string error)
    {
        Success = false;
        Error = error;
        Errors.Add(error);
        StatusCode = 401;
    }

    public void InternalServerError(string error)
    {
        Success = false;
        Error = error;
        Errors.Add(error);
        StatusCode = 500;
    }

    public void NotFound(string error)
    {
        Success = false;
        Error = error;
        Errors.Add(error);
        StatusCode = 404;
    }

    public void AddError(string error)
    {
        Errors.Add(error);
        Error = string.Join(", ", Errors);
        Success = false;
    }

    public static Result CreateSuccess()
    {
        var result = new Result();
        result.OK();
        return result;
    }

    public static Result CreateError(string error)
    {
        var result = new Result();
        result.BadRequest(error);
        return result;
    }
}

public class Result<T> : Result
{
    public T? Value { get; private set; }

    public Result() : base() { }

    public void AddValue(T value)
    {
        Value = value;
    }

    public static Result<T> CreateSuccess(T value)
    {
        var result = new Result<T>();
        result.AddValue(value);
        result.OK();
        return result;
    }

    public static Result<T> CreateError(string error)
    {
        var result = new Result<T>();
        result.BadRequest(error);
        return result;
    }
}
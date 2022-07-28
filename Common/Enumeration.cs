namespace N1mbly.Common
{
    public enum ErrorType
    {
        Error,
        NotFound,
        NoAccess,
    }

    public enum ParamType
    {
        Query,
        Path,
        Body,
        Form,
        Header,
        Services
    }

    public enum HttpMethod
    {
        Get,
        Post,
        Put,
        Delete,
        Patch
    }
}

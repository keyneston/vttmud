export interface IFile {
    fieldname?: string;
    originalname?: string;
    encoding?: string;
    mimetype?: string;
    size?: number;
    bucket?: string;
    key?: string;
    acl?: string;
    contentType?: string;
    contentDisposition?: string;
    contentEncoding?: string;
    storageClass?: string;
    serverSideEncryption?: string;
    location?: string;
    etag?: string;
    buffer?: Buffer;
}

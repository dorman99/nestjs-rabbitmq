export interface ResponseInterface {
    ok: Boolean,
    message: String,
    data: any | any[],
    validation?: object[]
}
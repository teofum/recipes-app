import { MAX_UPLOAD_SIZE } from "~/utils/constants"

export default function validateUploadSize(request: Request) {
  const contentLength = Number(request.headers.get('Content-Length'))
	if (
		contentLength &&
		Number.isFinite(contentLength) &&
		contentLength > MAX_UPLOAD_SIZE
	) throw new Error('Request body too large');
}
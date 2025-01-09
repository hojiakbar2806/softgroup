from pathlib import Path
from fastapi import HTTPException, UploadFile, status
from app.core.config import settings


async def save_image_file(image: UploadFile, image_path: Path) -> Path:
    file_ext = Path(image.filename).suffix.lower()

    if file_ext not in settings.ALLOWED_IMAGE_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported image format. Allowed formats: {
                ', '.join(settings.ALLOWED_IMAGE_TYPES)}"
        )
    try:
        image_content = await image.read()
        image_path.write_bytes(image_content)
        return image_path

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid image file: {str(e)}"
        )

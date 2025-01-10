import zipfile
from pathlib import Path
from io import BytesIO
from fastapi import APIRouter, HTTPException, UploadFile, status
from app.core.config import settings
from app.utils.translate import translate_text


async def save_template_file(template_file: UploadFile, slug: str) -> tuple[Path, Path]:
    file_ext = Path(template_file.filename).suffix.lower()

    if file_ext == '.zip':
        template_dir = settings.TEMPLATES_DIR / slug
        images_dir = settings.TEMPLATE_IMAGES_DIR / slug

        template_dir.mkdir(parents=True, exist_ok=True)
        images_dir.mkdir(parents=True, exist_ok=True)

        zip_file_bytes = await template_file.read()
        with zipfile.ZipFile(BytesIO(zip_file_bytes), "r") as zip_ref:
            if f"{zip_ref.namelist()[0]}index.html" not in zip_ref.namelist():
                template_dir.rmdir()
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="index.html file is not present in zip file"
                )
            zip_ref.extractall(template_dir)
            root_dir = Path(zip_ref.namelist()[0])

            for item in (template_dir / root_dir).iterdir():
                item.rename(template_dir / item.name)
            (template_dir / root_dir).rmdir()

        template_zip = template_dir / f"{slug}.zip"
        with template_zip.open("wb") as f:
            f.write(zip_file_bytes)

    elif file_ext in settings.ALLOWED_TEMPLATE_TYPES:
        template_dir = settings.DOCS_DIR / "documents"
        images_dir = settings.DOC_IMAGES_DIR / slug

        template_dir.mkdir(parents=True, exist_ok=True)
        images_dir.mkdir(parents=True, exist_ok=True)

        slug = f"{slug}{file_ext}"
        file_path = template_dir / f"{slug}"
        file_path.write_bytes(await template_file.read())

    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported template format. Allowed formats: {
                ', '.join(settings.ALLOWED_TEMPLATE_TYPES)}"
        )

    return slug, template_dir, images_dir

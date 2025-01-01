from slugify import slugify
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.template import Template


async def unique_slug(template_title: str, db: AsyncSession) -> str:
    base_slug = slugify(template_title, lowercase=True)
    slug = base_slug
    counter = 1

    while True:
        query = select(Template).filter(Template.slug == slug)
        result = await db.execute(query)
        existing_template = result.scalars().first()

        if existing_template is None:
            break
        else:
            slug = f"{base_slug}-{counter}"
            counter += 1

    return slug

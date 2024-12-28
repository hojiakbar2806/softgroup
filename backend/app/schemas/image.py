from pydantic import BaseModel

class ImageBase(BaseModel):
    url: str

class ImageCreate(ImageBase):
    pass

class Image(ImageBase):
    id: int
    template_id: int

    model_config = {
        "from_attributes": True
    }



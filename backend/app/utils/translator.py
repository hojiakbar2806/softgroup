from googletrans import Translator
from typing import Tuple, Optional

translator = Translator()


async def translate_text(text: str) -> Optional[Tuple[str, str, str]]:
    try:
        if not text or not text.strip():
            return None

        detected = await translator.detect(text)

        if not detected or not detected.lang:
            return None

        if detected.lang == 'ru':
            translated_uz = await translator.translate(text, src='ru', dest='uz')
            translated_en = await translator.translate(text, src='ru', dest='en')
            return (translated_uz.text, text, translated_en.text)

        elif detected.lang == 'uz':
            translated_ru = await translator.translate(text, src='uz', dest='ru')
            translated_en = await translator.translate(text, src='uz', dest='en')
            return (text, translated_ru.text, translated_en.text)

        elif detected.lang == 'en':
            translated_ru = await translator.translate(text, src='en', dest='ru')
            translated_uz = await translator.translate(text, src='en', dest='uz')
            return (translated_uz.text, translated_ru.text, text)

        return (text, text, text)

    except Exception as e:
        print(f"Translation error: {str(e)}")
        return None

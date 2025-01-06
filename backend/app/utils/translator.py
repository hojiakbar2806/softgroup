from googletrans import Translator

translator = Translator()


async def translate_text(text):
    detected_language = await translator.detect(text)

    if detected_language.lang == 'ru':
        translated_uz = await translator.translate(text, src='ru', dest='uz')
        translated_en = await translator.translate(text, src='ru', dest='en')
        return (translated_uz.text, translated_en.text, text)

    elif detected_language.lang == 'uz':
        translated_ru = await translator.translate(text, src='uz', dest='ru')
        translated_en = await translator.translate(text, src='uz', dest='en')
        return (text,  translated_en.text, translated_ru.text)

    elif detected_language.lang == 'en':
        translated_ru = await translator.translate(text, src='en', dest='ru')
        translated_uz = await translator.translate(text, src='en', dest='uz')
        return (translated_uz.text, translated_ru.text, text)

from aiogram.fsm.state import State, StatesGroup


class SearchState(StatesGroup):
    search = State()

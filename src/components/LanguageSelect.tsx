import { Dispatch, SetStateAction, useState } from 'react'
import { Language } from '../types/type'

type LanguageOptions = Record<Language, string>

const languageOptions: LanguageOptions = {
  vi: 'Tiếng Việt',
  en: 'English',
  ja: '日本語',
}

export default function LanguageSelect({
  language,
  setLanguage,
}: {
  language: Language
  setLanguage: Dispatch<SetStateAction<Language>>
}) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative text-xs">
      {/* Button hiển thị */}
      <button
        onClick={() => setOpen(!open)}
        className="flex w-28 items-center justify-center gap-2 rounded-md border border-zinc-600 bg-zinc-800 px-4 py-2 transition hover:bg-zinc-700"
      >
        {languageOptions[language]}
        {/* Dropdown icon  */}
        <span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m19.5 8.25-7.5 7.5-7.5-7.5"
            />
          </svg>
        </span>
      </button>

      {/* Dropdown */}
      {open && (
        <ul className="absolute right-0 z-50 mt-2 w-28 rounded-lg border border-zinc-700 bg-zinc-800 shadow-lg">
          {Object.entries(languageOptions).map(([key, value]) => (
            <li
              key={key}
              onClick={() => {
                setLanguage(key as Language)
                setOpen(false)
              }}
              className="cursor-pointer px-4 py-3 text-zinc-100 hover:bg-zinc-700"
            >
              {value}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

import { createContext, ReactNode, useContext, useState } from "react";
import { IntlProvider } from "react-intl";
import en from "../../translations/en.json";
import mk from "../../translations/mk.json";

interface LanguageSwitcherProps {
  currentLanguage: "en" | "mk";
  handleChangeLanguage: (selectedLanguage: "en" | "mk") => void;
}

const initialState: LanguageSwitcherProps = {
  currentLanguage: "en",
  handleChangeLanguage: () => null,
};

/**  Function that creates the context, storing information (global state) that can be used across all components. */
const LanguageSwitcherStore =
  createContext<LanguageSwitcherProps>(initialState);

/** Function that returns the Context of LanguageSwitcherStore.tsx. */
export const useLanguageSwitcherSelector = () =>
  useContext(LanguageSwitcherStore);

/** Functional component that serves as a Provider for language state across all components.
 * @param {ReactNode} children Presents everything that is rendered, all components, wrapped in providers to use states and functions on global level.
 */
function LanguageSwitcherProvider({ children }: { children: ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<"en" | "mk">("en");

  const handleChangeLanguage = (selectedLanguage: "en" | "mk") =>
    setCurrentLanguage(selectedLanguage);

  const messages = {
    en: en,
    mk: mk,
  };

  return (
    <IntlProvider locale={currentLanguage} messages={messages[currentLanguage]}>
      <LanguageSwitcherStore.Provider
        value={{ currentLanguage, handleChangeLanguage }}
      >
        {children}
      </LanguageSwitcherStore.Provider>
    </IntlProvider>
  );
}

export default LanguageSwitcherProvider;

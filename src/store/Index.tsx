import { ReactNode } from "react";
import LanguageSwitcherProvider from "./language-switcher/LanguageSwitcher";
import ApplicationStoreProvider from "./ApplicationStore";

/** Wrapper component for providers.
 * @param {ReactNode} children Presents everything that is rendered, all components, wrapped in providers to use states and functions on global level.
 */
function ApplicationProvider({ children }: { children: ReactNode }) {
  return (
    <LanguageSwitcherProvider>
      <ApplicationStoreProvider>{children}</ApplicationStoreProvider>
    </LanguageSwitcherProvider>
  );
}

export default ApplicationProvider;

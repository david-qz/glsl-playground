import { type ReactElement } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AuthForm from "./components/auth-form/auth-form";
import Dashboard from "./components/dashboard/dashboard";
import Editor from "./components/editor/editor";
import HeaderLayout from "./components/header-layout/header-layout";
import NotFound from "./components/not-found/not-found";
import SaveProgram from "./components/save-program/save-program";
import { AuthContextProvider } from "./hooks/use-auth-context";

export default function App(): ReactElement {
  return (
    <AuthContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Editor />} />
          <Route path="/program/:id" element={<Editor />} />
          <Route element={<HeaderLayout />}>
            <Route path="/auth" element={<AuthForm />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path='/save-program' element={<SaveProgram />} />
            <Route path='*' element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthContextProvider>
  );
}

import { Link } from "react-router-dom";
import React, { MouseEvent } from "react";
import { useAuth } from "../routes/auth/authprovider";

interface PortalLayoutProps {
  children?: React.ReactNode;
}

export default function PortalLayout({ children }: PortalLayoutProps) {
  const auth = useAuth();

  async function handleSignOut(e: MouseEvent) {
    e.preventDefault();
    auth.logout();
  }

  return (
    <>
      <header>
        <nav>
          <ul>
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li>
              <a href="#" onClick={handleSignOut}>
                Sign out
              </a>
            </li>
            <li>
              {auth.user}
            </li>
          </ul>
        </nav>
      </header>

      <main>{children}</main>
    </>
  );
}
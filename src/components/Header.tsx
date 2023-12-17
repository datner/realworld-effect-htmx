import { Html } from "@kitajs/html";

interface HeaderProps {
  active: string;
}
export function Header(props: HeaderProps) {
  const { active } = props;
  return (
    <nav id="header" hx-swap-oob="true" class="navbar navbar-light">
      <div class="container">
        <a class="navbar-brand" href="/">conduit</a>
        <ul _="on htmx:beforeOnLoad take .active from .nav-link for event.target" class="nav navbar-nav pull-xs-right">
          <li class="nav-item">
            <a class={["nav-link", active === "/" && "active"]} href="/">Home</a>
          </li>
          <li class="nav-item">
            <a class={["nav-link", active === "/login" && "active"]} href="/login">Sign in</a>
          </li>
          <li class="nav-item">
            <a class={["nav-link", active === "/register" && "active"]} href="/register">Sign up</a>
          </li>
        </ul>
      </div>
    </nav>
  );
}

import { Html, PropsWithChildren } from "@kitajs/html";

export function Page(props: PropsWithChildren) {
  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Conduit</title>
        <link
          href="//code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css"
          rel="stylesheet"
          type="text/css"
        />
        <link
          href="//fonts.googleapis.com/css?family=Titillium+Web:700|Source+Serif+Pro:400,700|Merriweather+Sans:400,700|Source+Sans+Pro:400,300,600,700,300italic,400italic,600italic,700italic"
          rel="stylesheet"
          type="text/css"
        />
        <link rel="stylesheet" href="//demo.productionready.io/main.css" />
        <script
          src="https://unpkg.com/htmx.org@1.9.9"
          integrity="sha384-QFjmbokDn2DjBjq+fM+8LUIVrAgqcNW2s0PjAxHETgRn9l4fvX31ZxDxvwQnyMOX"
          crossorigin="anonymous"
        >
        </script>
        <script src="https://unpkg.com/hyperscript.org@0.9.12"></script>
      </head>
      <body hx-boost="true" hx-target="main">
        {props.children}
      </body>
    </html>
  );
}

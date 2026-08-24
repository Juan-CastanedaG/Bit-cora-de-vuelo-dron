# Guía para publicar e instalar la Bitácora de Vuelo Dron (PWA)

Al terminar vas a tener la app instalada en el celular, con ícono en la pantalla de inicio, funcionando **sin internet** y con **GPS automático**. Internet solo hace falta una vez: para instalarla y para actualizarla.

---

## Lo que necesitás

- Una cuenta de GitHub (gratis).
- Los **5 archivos** de la app (los que te entregué):
  - `index.html`
  - `manifest.json`
  - `sw.js`
  - `icon-192.png`
  - `icon-512.png`
- Un computador para subir los archivos (más cómodo que el celular) y el celular para instalarla.

> **Importante:** el archivo principal tiene que llamarse exactamente `index.html`. No lo renombres.

---

## FASE 1 — Crear la cuenta de GitHub (si ya tenés, saltá a la Fase 2)

1. Entrá a **https://github.com**.
2. Clic en **Sign up**.
3. Escribí tu correo, una contraseña y un nombre de usuario. Ese usuario va a ser parte de la dirección de tu app, así que elegí algo prolijo (ej. `jperez-epm`).
4. Verificá el correo que te llega y completá el registro.

---

## FASE 2 — Crear el repositorio

Un "repositorio" es la carpeta en la nube donde van a vivir los archivos.

1. Ya con la sesión iniciada, arriba a la derecha clic en el **+** y luego en **New repository**.
2. En **Repository name** escribí un nombre sin espacios, por ejemplo: `bitacora-dron`.
3. Dejá el tipo en **Public** (Público).
   > GitHub Pages gratis **exige repositorio público** para publicar desde una rama. Tranquilo: se hace público el *código* de la app, **no tus datos** (los datos se quedan en el teléfono).
4. **No** marques "Add a README", ni .gitignore, ni licencia. Dejalo vacío.
5. Clic en **Create repository**.

---

## FASE 3 — Subir los 5 archivos

1. En la página del repositorio recién creado, buscá el enlace **uploading an existing file** (aparece en el texto del centro). Si no lo ves, andá a **Add file → Upload files**.
2. Arrastrá los **5 archivos** juntos (o clic en **choose your files** y seleccionalos todos).
   - Verificá que aparezcan los cinco: `index.html`, `manifest.json`, `sw.js`, `icon-192.png`, `icon-512.png`.
3. Bajá hasta **Commit changes** y clic en el botón verde **Commit changes**.
4. Deberías ver los 5 archivos listados en la página del repositorio.

> Todos los archivos deben quedar en la **raíz** del repositorio (no dentro de una subcarpeta).

---

## FASE 4 — Activar GitHub Pages

1. En la página del repositorio, clic en la pestaña **Settings** (arriba a la derecha).
2. En el menú de la izquierda, dentro de "Code and automation", clic en **Pages**.
3. En **Build and deployment → Source**, elegí **Deploy from a branch**.
4. En **Branch**, cambiá el desplegable de `None` a **main**, y dejá la carpeta en **/ (root)**.
5. Clic en **Save**.
6. Esperá 1 a 2 minutos (a veces hasta 10). Refrescá la página de Pages.
7. Arriba aparecerá un recuadro con tu dirección, del tipo:
   **`https://TU-USUARIO.github.io/bitacora-dron/`**
   Copiala. Esa es la URL de tu app.

> Si el botón "Deploy from a branch" aparece deshabilitado, casi siempre es porque el repositorio quedó **privado**. Volvé a Settings → General → Danger Zone y cambialo a **Public**.

---

## FASE 5 — Probar la URL

1. Abrí esa dirección en el navegador del computador. Debe cargar la Bitácora.
2. Si ves un **404**, esperá unos minutos más y refrescá: la primera publicación tarda. Revisá también que `index.html` esté en la raíz.

---

## FASE 6 — Instalar en el celular (Android / Chrome)

1. En el celular, abrí **Chrome** (no el navegador de Samsung, para la primera vez es más predecible).
2. Escribí o pegá la **URL** de tu app y entrá.
3. Esperá a que cargue del todo (así el service worker guarda la copia offline).
4. Tocá el menú de los **tres puntos (⋮)** arriba a la derecha.
5. Tocá **Agregar a pantalla principal** o **Instalar aplicación** (el nombre varía según la versión).
6. Confirmá. Aparece el **ícono verde con el dron** en tu pantalla de inicio.

---

## FASE 7 — Primer uso y verificaciones

1. Abrí la app **desde el ícono** (no desde el navegador). Debe abrir en pantalla completa, sin barra de direcciones.
2. La primera vez que uses **📍 Usar mi ubicación** (en Nueva → Datos generales), el celular te pedirá permiso de **Ubicación**. Tocá **Permitir**.
3. **Probá el GPS:** en una operación nueva, tocá **📍 Usar mi ubicación**. Debe llenar latitud y longitud solo, con la precisión en metros.
4. **Probá el modo offline:** activá **modo avión** y abrí la app desde el ícono. Debe abrir y funcionar igual.
5. **Verificá el almacenamiento:** andá a la pestaña **Datos**. En "Almacenamiento", el modo debería decir **IndexedDB** (ahora sí, porque corre sobre HTTPS). Ese era el objetivo de todo esto.

---

## FASE 8 — Actualizar la app más adelante

Cuando tengamos una versión nueva del `index.html` (o cualquier archivo):

1. En el repositorio, **Add file → Upload files** y subí el archivo nuevo (reemplaza al anterior automáticamente si tiene el mismo nombre).
2. **Importante:** si cambió el `index.html`, abrí también el archivo `sw.js` (clic en el archivo → ícono del lápiz ✏️) y subile de número la línea de la versión, por ejemplo de `const CACHE = 'bvd-v7';` a `'bvd-v8';`. Eso obliga a los teléfonos a tomar la versión nueva. Guardá con **Commit changes**.
3. En el celular, abrí la app **con internet** una vez. El service worker descarga la versión nueva en segundo plano; ciérrala y volvé a abrirla para que quede aplicada.

> Tus datos (proyectos, operaciones, fotos) **no se pierden** al actualizar: viven en el teléfono, no en la app.

---

## Variante para iPhone (Safari)

1. Abrí la URL en **Safari** (en iPhone tiene que ser Safari, no Chrome).
2. Tocá el botón **Compartir** (el cuadrado con la flecha hacia arriba).
3. Tocá **Añadir a pantalla de inicio** y confirmá.
4. Abrí desde el ícono. El GPS y el modo offline funcionan igual.

> En iPhone, iOS puede liberar el almacenamiento de apps que no se usan por mucho tiempo. Por eso, en iPhone conviene **descargar el respaldo JSON** (pestaña Datos) con más frecuencia.

---

## Solución de problemas

- **Sale 404 al abrir la URL:** esperá 5–10 minutos tras activar Pages y refrescá. Confirmá que `index.html` está en la raíz y que la rama es `main`.
- **La app no abre sin internet:** asegurate de haberla abierto **una vez con internet** desde el ícono (ahí el service worker guarda la copia). Confirmá que `sw.js` se subió.
- **El GPS dice que necesita HTTPS:** estás abriendo el archivo local viejo, no la URL. Abrí siempre **desde el ícono instalado**.
- **No aparece "Instalar / Agregar a pantalla principal":** cargá la página completa y volvé a abrir el menú ⋮. Algunas versiones lo muestran como un ícono de instalar en la barra de direcciones.
- **Los íconos no se ven:** revisá que `icon-192.png` e `icon-512.png` se hayan subido con esos nombres exactos.

---

## Sobre la privacidad

La app publicada en GitHub es solo el **programa**. Todo lo que cargues —proyectos, operaciones, pilotos, radicados, coordenadas, fotos— se guarda **únicamente en el teléfono** (almacenamiento local del navegador) y **nunca se sube a GitHub**. Aun así, por ser una herramienta interna de EPM, lo más prolijo a futuro es alojarla en un espacio corporativo o privado de EPM en vez de un GitHub público; el funcionamiento es idéntico.

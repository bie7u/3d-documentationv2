# Kreator Dokumentacji 3D

Aplikacja webowa do tworzenia instrukcji krok po kroku z wizualizacją 3D w czasie rzeczywistym.

## Technologie

- **React** - biblioteka UI
- **Vite** - bundler i dev server
- **React Three Fiber** - React renderer dla Three.js
- **@react-three/drei** - pomocnicze komponenty dla R3F
- **Three.js** - biblioteka 3D
- **Zustand** - zarządzanie stanem aplikacji

## Funkcjonalności

### 1. Zarządzanie krokami
- Dodawanie nowych kroków
- Edycja istniejących kroków
- Usuwanie kroków
- Wybór aktywnego kroku
- Lista wszystkich kroków z podglądem

### 2. Formularz kroku
- Nazwa kroku
- Opis kroku (textarea)
- Wybór modelu 3D:
  - Kostka (cube)
  - Cylinder (cylinder)
  - Kula (sphere)
  - Stożek (cone)
- Parametry:
  - Kolor (color picker)
  - Rozmiar (slider)
  - Pozycja X, Y, Z

### 3. Scena 3D
- Renderowanie wszystkich kroków jako obiektów 3D
- Wizualne połączenia między krokami (żółte linie)
- Kamera z OrbitControls (obracanie, zoom, pan)
- Podstawowe oświetlenie (ambient + directional + point)
- Siatka pomocnicza (grid)
- Animacja aktywnego obiektu (obracanie)
- Podświetlenie aktywnego obiektu

### 4. Logika połączeń
- Każdy nowy krok jest automatycznie połączony z poprzednim
- Połączenia są wizualizowane jako żółte linie w scenie 3D
- Przy usunięciu kroku, połączenia są aktualizowane

### 5. Widok aplikacji
- **Lewy panel**: Lista kroków z opcją wyboru i usuwania
- **Środkowy panel**: Scena 3D z renderowaniem obiektów
- **Prawy panel**: Formularz do edycji/dodawania kroków

## Struktura projektu

```
src/
├── components/
│   ├── StepsList/
│   │   ├── StepsList.jsx
│   │   └── StepsList.css
│   ├── StepForm/
│   │   ├── StepForm.jsx
│   │   └── StepForm.css
│   └── Scene3D/
│       ├── Scene3D.jsx
│       ├── Scene3D.css
│       ├── Shape3D.jsx
│       └── Connection.jsx
├── store/
│   └── useStepsStore.js
├── App.jsx
├── App.css
├── main.jsx
└── index.css
```

## Instalacja i uruchomienie

### Wymagania
- Node.js (wersja 18 lub nowsza)
- npm lub yarn

### Kroki

1. **Instalacja zależności:**
```bash
npm install
```

2. **Uruchomienie aplikacji deweloperskiej:**
```bash
npm run dev
```

3. **Otwórz przeglądarkę:**
Aplikacja będzie dostępna pod adresem `http://localhost:5173`

### Dodatkowe komendy

```bash
# Build produkcyjny
npm run build

# Podgląd build produkcyjnego
npm run preview

# Linting
npm run lint
```

## Użytkowanie

1. **Przeglądanie kroków**: Kliknij na krok w lewym panelu, aby go aktywować
2. **Edycja kroku**: Po wybraniu kroku, edytuj jego parametry w prawym panelu
3. **Dodawanie kroku**: Kliknij "Nowy Krok" w prawym panelu, wypełnij formularz i kliknij "Dodaj Krok"
4. **Usuwanie kroku**: Najedź na krok w lewym panelu i kliknij przycisk "×"
5. **Manipulacja sceną 3D**:
   - Lewy przycisk myszy + przeciągnięcie = obracanie kamery
   - Prawy przycisk myszy + przeciągnięcie = przesuwanie widoku
   - Scroll = zoom in/out

## Przykładowe dane

Aplikacja startuje z trzema przykładowymi krokami:
1. Krok 1: Podstawa (kostka, niebieski)
2. Krok 2: Połączenie (cylinder, czerwony)
3. Krok 3: Element sferyczny (kula, zielony)

## Struktura danych

Każdy krok zawiera:
```javascript
{
  id: string,           // Unikalny identyfikator
  title: string,        // Nazwa kroku
  description: string,  // Opis kroku
  shapeType: string,    // 'cube', 'cylinder', 'sphere', 'cone'
  position: [x, y, z],  // Pozycja w przestrzeni 3D
  color: string,        // Kolor w formacie hex
  size: number,         // Rozmiar obiektu
  connections: string   // ID poprzedniego kroku (null dla pierwszego)
}
```

## Autor

Stworzono z użyciem React, Three.js i React Three Fiber.

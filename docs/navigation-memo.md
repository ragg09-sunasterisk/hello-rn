# Navigation memo — one two-screen stack, three ways

The example: **NoteList → NoteDetail**, passing `{ id: string }`.

## 1. Expo Router (what this app uses)

```tsx
// app/_layout.tsx
export default function Layout() {
  return <Stack />;
}

// app/index.tsx (NoteList)
<Link href={{ pathname: "/notes/[id]", params: { id: "7" } }}>Open</Link>;

// app/notes/[id].tsx (NoteDetail)
const { id } = useLocalSearchParams<{ id: string }>();
```

## 2. React Navigation — static API (current RN docs)

```tsx
function NoteDetail({ route }: StaticScreenProps<{ id: string }>) {
  return <Text>{route.params.id}</Text>;
}

const RootStack = createNativeStackNavigator({
  screens: { NoteList, NoteDetail },
});

type RootStackParamList = StaticParamList<typeof RootStack>;
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

const Navigation = createStaticNavigation(RootStack);
export default function App() {
  return <Navigation />;
}

// in NoteList
const navigation = useNavigation();
navigation.navigate("NoteDetail", { id: "7" });
```

## 3. React Navigation — dynamic API (most tutorials)

```tsx
type RootStackParamList = {
  NoteList: undefined;
  NoteDetail: { id: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function NoteDetail({
  route,
}: NativeStackScreenProps<RootStackParamList, "NoteDetail">) {
  return <Text>{route.params.id}</Text>;
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="NoteList" component={NoteList} />
        <Stack.Screen name="NoteDetail" component={NoteDetail} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// in NoteList
navigation.navigate("NoteDetail", { id: "7" });
```

## The diff

|                  | Expo Router                                  | RN static                                 | RN dynamic                                  |
| ---------------- | -------------------------------------------- | ----------------------------------------- | ------------------------------------------- |
| Screens declared | Files in `app/`                              | `screens: {}` object                      | `<Stack.Screen>` JSX                        |
| Navigate         | `router.push()` / `<Link href>` (a path)     | `navigation.navigate("Name", params)`     | same as static                              |
| Read params      | `useLocalSearchParams<T>()`                  | `route.params` via `StaticScreenProps<T>` | `route.params` via `NativeStackScreenProps` |
| Param types      | Generated from the file tree (`typedRoutes`) | Inferred with `StaticParamList`           | Written by hand in `RootStackParamList`     |
| Deep links       | Automatic: URL = file path                   | `linking` config you write                | `linking` config you write                  |
| Container        | Hidden                                       | Hidden (`createStaticNavigation`)         | Explicit `NavigationContainer`              |

**Takeaway:** Expo Router runs on React Navigation underneath. The file tree replaces the navigator code, but screen options like `presentation: "modal"`, `headerRight` and `title` work the same in all three.

## Stretch — why the deep link carries only the id

- **Any app can claim `fieldkit://`.** There's no registry of URL schemes, so a malicious app can register the same one and receive the link.
- **URLs leak.** They end up in logs, browser history, the clipboard, chat messages and analytics.
- **So the link carries only a reference.** The app loads the rest (title, body, location) itself and checks access.
- **Never put sensitive data in it:** no tokens, credentials or personal data. Even a note's title or coordinates can be private.
- **Unknown ids are handled.** An id that doesn't exist shows "Not found" instead of crashing (the `if (!note)` branch).
- **For links that must be trusted,** use iOS Universal Links or Android App Links, which are tied to a domain you own.

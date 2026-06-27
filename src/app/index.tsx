import { NavigationIndependentTree, NavigationContainer } from '@react-navigation/native';
import RootNavigator from '../navigation/RootNavigator';

export default function App() {
  return (
    <NavigationIndependentTree>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </NavigationIndependentTree>
  );
}

import { RouteObject } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import RestaurantDetails from './pages/RestaurantDetails';
import Profile from './pages/Profile';

export const routes: RouteObject[] = [
  { path: '/', element: <Home /> },
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
  { path: '/restaurants/:id', element: <RestaurantDetails /> },
  { path: '/profile', element: <Profile /> },
];

import React, { useState } from 'react';
import { Button } from './components/ui/button';
import { Menu, Home as HomeIcon } from 'lucide-react';
import { HomePage } from './components/HomePage';
import { SearchFilters } from './components/SearchFilters';
import { PropertyDetails } from './components/PropertyDetails';
import { LoginSignup } from './components/LoginSignup';
import { HostLoginSignup } from './components/HostLoginSignup';
import { HostDashboard } from './components/HostDashboard';
import { AddProperty } from './components/AddProperty';
import { BookingRequest } from './components/BookingRequest';
import { Messages } from './components/Messages';
import { SideMenu } from './components/SideMenu';
import { Policies } from './components/Policies';
import { Toaster } from 'sonner';
import { toast } from 'sonner';

type Page = 'home' | 'search' | 'property' | 'login' | 'host-dashboard' | 'add-property' | 'booking' | 'messages' | 'policies' | 'become-host' | 'reviews';

interface FilterValues {
  searchQuery: string;
  minPrice: string;
  maxPrice: string;
  area: string;
  neighborhood: string;
  rooms: string;
  conditions: string[];
}

interface UserState {
  isLoggedIn: boolean;
  role: 'tenant' | 'host' | null;
  email: string;
}

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [user, setUser] = useState<UserState>({
    isLoggedIn: false,
    role: null,
    email: '',
  });

  // Mock property data
  const mockProperties = [
    {
      id: '1',
      title: 'Modern 3-Bedroom Apartment in Al Remal',
      location: 'Gaza City',
      neighborhood: 'Al Remal',
      price: 350,
      rooms: 3,
      rating: 4.7,
      reviewCount: 24,
      hostName: 'Ahmed Hassan',
      image: 'https://images.unsplash.com/photo-1651752523215-9bf678c29355?w=800',
      condition: 'Partially damaged',
    },
    {
      id: '2',
      title: 'Cozy 2-Bedroom House in Tel Al Hawa',
      location: 'Gaza City',
      neighborhood: 'Tel Al Hawa',
      price: 280,
      rooms: 2,
      rating: 4.5,
      reviewCount: 18,
      hostName: 'Sara Mohammed',
      image: 'https://images.unsplash.com/photo-1756706718604-ef4af3970e33?w=800',
      condition: 'Ready to move',
    },
    {
      id: '3',
      title: 'Spacious 4-Bedroom Family Home',
      location: 'Khan Younis',
      neighborhood: 'Khan Younis Camp',
      price: 420,
      rooms: 4,
      rating: 4.9,
      reviewCount: 32,
      hostName: 'Khaled Omar',
      image: 'https://images.unsplash.com/photo-1630912121186-16bea8d6f241?w=800',
      condition: 'Ready to move',
    },
    {
      id: '4',
      title: 'Affordable Studio Apartment',
      location: 'Gaza City',
      neighborhood: 'Al Nasr',
      price: 200,
      rooms: 1,
      rating: 4.3,
      reviewCount: 12,
      hostName: 'Fatima Ali',
      image: 'https://images.unsplash.com/photo-1628624747186-a941c476b7ef?w=800',
      condition: 'Broken windows',
    },
    {
      id: '5',
      title: 'Beautiful 3-Bedroom near Beach',
      location: 'North Gaza',
      neighborhood: 'Beit Lahia',
      price: 380,
      rooms: 3,
      rating: 4.8,
      reviewCount: 28,
      hostName: 'Mahmoud Youssef',
      image: 'https://images.unsplash.com/photo-1651752523215-9bf678c29355?w=800',
      condition: 'Ready to move',
    },
    {
      id: '6',
      title: 'Renovated 2-Bedroom Apartment',
      location: 'Middle Area',
      neighborhood: 'Deir Al Balah',
      price: 300,
      rooms: 2,
      rating: 4.6,
      reviewCount: 20,
      hostName: 'Nour Ahmed',
      image: 'https://images.unsplash.com/photo-1756706718604-ef4af3970e33?w=800',
      condition: 'Unfinished plaster',
    },
  ];

  // Sort properties by rating
  const [properties, setProperties] = useState(
    [...mockProperties].sort((a, b) => b.rating - a.rating)
  );

  const handlePropertyClick = (id: string) => {
    setSelectedPropertyId(id);
    setCurrentPage('property');
  };

  const handleSearchClick = () => {
    setCurrentPage('search');
  };

  const handleSearch = (filters: FilterValues) => {
    // Filter properties based on search criteria
    let filtered = [...mockProperties];

    if (filters.searchQuery) {
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        p.location.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        p.neighborhood.toLowerCase().includes(filters.searchQuery.toLowerCase())
      );
    }

    if (filters.minPrice) {
      filtered = filtered.filter(p => p.price >= parseInt(filters.minPrice));
    }

    if (filters.maxPrice) {
      filtered = filtered.filter(p => p.price <= parseInt(filters.maxPrice));
    }

    if (filters.area) {
      filtered = filtered.filter(p => p.location === filters.area);
    }

    if (filters.neighborhood) {
      filtered = filtered.filter(p => p.neighborhood === filters.neighborhood);
    }

    if (filters.rooms) {
      const roomsValue = filters.rooms === '5+' ? 5 : parseInt(filters.rooms);
      filtered = filtered.filter(p => 
        filters.rooms === '5+' ? p.rooms >= roomsValue : p.rooms === roomsValue
      );
    }

    if (filters.conditions.length > 0) {
      filtered = filtered.filter(p => 
        filters.conditions.some(condition => p.condition === condition)
      );
    }

    setProperties(filtered.sort((a, b) => b.rating - a.rating));
    setCurrentPage('home');
    toast.success(`Found ${filtered.length} properties matching your criteria`);
  };

  const handleNavigate = (page: string) => {
    if (page === 'become-host' || page === 'host-dashboard') {
      if (!user.isLoggedIn) {
        setCurrentPage('become-host');
        return;
      }
      if (user.role === 'tenant') {
        toast.error('Please create a host account to access this feature');
        return;
      }
    }

    if (page === 'messages' && !user.isLoggedIn) {
      setCurrentPage('login');
      toast.info('Please log in to view messages');
      return;
    }

    setCurrentPage(page as Page);
  };

  const handleLogin = (role: 'tenant' | 'host', email: string) => {
    setUser({ isLoggedIn: true, role, email });
    toast.success(`Welcome back!`);
    if (role === 'host') {
      setCurrentPage('host-dashboard');
    } else {
      setCurrentPage('home');
    }
  };

  const handleBookNow = (propertyId: string) => {
    if (!user.isLoggedIn) {
      setCurrentPage('login');
      toast.info('Please log in to book a property');
      return;
    }
    setSelectedPropertyId(propertyId);
    setCurrentPage('booking');
  };

  const handleBookingSubmit = () => {
    toast.success('Booking request sent successfully! The host will review your request.');
    setCurrentPage('home');
  };

  const handleAddPropertySubmit = () => {
    toast.success('Property published successfully!');
    setCurrentPage('host-dashboard');
  };

  const handleGoHome = () => {
    setCurrentPage('home');
  };

  const handleHomeClick = () => {
    setCurrentPage('home');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <HomePage
            properties={properties}
            onPropertyClick={handlePropertyClick}
            onSearchClick={handleSearchClick}
          />
        );

      case 'search':
        return (
          <SearchFilters
            onBack={() => setCurrentPage('home')}
            onSearch={handleSearch}
          />
        );

      case 'property':
        return selectedPropertyId ? (
          <PropertyDetails
            propertyId={selectedPropertyId}
            onBack={() => setCurrentPage('home')}
            onBookNow={handleBookNow}
          />
        ) : (
          <HomePage
            properties={properties}
            onPropertyClick={handlePropertyClick}
            onSearchClick={handleSearchClick}
          />
        );

      case 'login':
        return (
          <LoginSignup
            onBack={() => setCurrentPage('home')}
            onLogin={handleLogin}
            mode='tenant'
          />
        );

      case 'become-host':
        return (
          <HostLoginSignup
            onBack={() => setCurrentPage('home')}
            onLogin={handleLogin}
          />
        );

      case 'host-dashboard':
        return (
          <HostDashboard
            onBack={() => setCurrentPage('home')}
            onAddProperty={() => setCurrentPage('add-property')}
            onViewMessages={() => setCurrentPage('messages')}
          />
        );

      case 'add-property':
        return (
          <AddProperty
            onBack={() => setCurrentPage('host-dashboard')}
            onSubmit={handleAddPropertySubmit}
          />
        );

      case 'booking':
        const property = properties.find(p => p.id === selectedPropertyId);
        return property ? (
          <BookingRequest
            propertyId={property.id}
            propertyTitle={property.title}
            price={property.price}
            onBack={() => setCurrentPage('property')}
            onSubmit={handleBookingSubmit}
          />
        ) : (
          <HomePage
            properties={properties}
            onPropertyClick={handlePropertyClick}
            onSearchClick={handleSearchClick}
          />
        );

      case 'messages':
        return <Messages onBack={() => setCurrentPage('home')} />;

      case 'policies':
        return <Policies onBack={() => setCurrentPage('home')} />;

      default:
        return (
          <HomePage
            properties={properties}
            onPropertyClick={handlePropertyClick}
            onSearchClick={handleSearchClick}
          />
        );
    }
  };

  return (
    <div className="min-h-screen">
      {/* Fixed Header - Show on all pages */}
      <header className="fixed top-0 left-0 right-0 z-30 bg-gradient-to-r from-[#8DA87A] to-[#A5B88A] px-4 py-3 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={handleHomeClick} className="hover:bg-white/10">
              <HomeIcon className="w-6 h-6" />
            </Button>
            <h1 className="text-white">Beit Gaza</h1>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSideMenuOpen(true)}
            className="text-white hover:bg-white/20"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </Button>
        </div>
      </header>

      {/* Add padding to main content for fixed header */}
      <main className="pt-14">
        {renderPage()}
      </main>

      {/* Side Menu */}
      <SideMenu
        isOpen={isSideMenuOpen}
        onClose={() => setIsSideMenuOpen(false)}
        onNavigate={handleNavigate}
        isLoggedIn={user.isLoggedIn}
        userRole={user.role}
      />

      {/* Toast Notifications */}
      <Toaster position="top-center" richColors />
    </div>
  );
}

export default App;
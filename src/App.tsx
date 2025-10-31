import React, { useCallback, useEffect, useState } from 'react';
import QRCode from 'react-qr-code';
import { MapContainer, TileLayer, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Partner data for Urla Sanat Sokağı (approximate coordinates; refine as needed)
const PARTNERS = [
  {
    id: 'avlu-urla',
    name: 'Avlu Urla Bistro & Bar',
    type: 'restaurant',
    lat: 38.3242,
    lng: 26.7648,
    radius: 120, // meters
    imageUrl: 'https://images.unsplash.com/photo-1528605105345-5344ea20e269?q=80&w=1600&auto=format&fit=crop',
    offer: {
      title: 'Akşam Menüsü İçecekli',
      originalPrice: 900,
      price: 750,
      currency: 'TL',
      barcode: 'AVLU-URLA-750',
      expiresMins: 120,
    },
  },
  {
    id: 'hic-urla',
    name: 'Hiç Urla',
    type: 'restaurant',
    lat: 38.3246,
    lng: 26.7651,
    radius: 120,
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1600&auto=format&fit=crop',
    offer: {
      title: 'Yeni Urla Mutfağı Tadım',
      originalPrice: 1800,
      price: 1500,
      currency: 'TL',
      barcode: 'HIC-URLA-1500',
      expiresMins: 120,
    },
  },
  {
    id: 'irmik-hanim',
    name: 'İrmik Hanım Patisserie',
    type: 'bakery',
    lat: 38.3237,
    lng: 26.7661,
    radius: 120,
    imageUrl: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?q=80&w=1600&auto=format&fit=crop',
    offer: {
      title: 'Tatlı + Kahve',
      originalPrice: 220,
      price: 180,
      currency: 'TL',
      barcode: 'IRMIK-HANIM-180',
      expiresMins: 60,
    },
  },
  {
    id: 'istifci-urla',
    name: 'İstifçi Urla',
    type: 'restaurant',
    lat: 38.3240,
    lng: 26.7656,
    radius: 120,
    imageUrl: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1600&auto=format&fit=crop',
    offer: {
      title: 'Pizza + İçecek',
      originalPrice: 420,
      price: 340,
      currency: 'TL',
      barcode: 'ISTIFCI-URLA-340',
      expiresMins: 90,
    },
  },
  {
    id: 'kuyulu-cafe',
    name: 'Kuyulu Cafe',
    type: 'cafe',
    lat: 38.3245,
    lng: 26.7645,
    radius: 120,
    imageUrl: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?q=80&w=1600&auto=format&fit=crop',
    offer: {
      title: 'Dondurma + Kahve',
      originalPrice: 140,
      price: 110,
      currency: 'TL',
      barcode: 'KUYULU-CAFE-110',
      expiresMins: 60,
    },
  },
  {
    id: 'naturla-yaka',
    name: 'Sanat Sokağı Naturla, Yaka',
    type: 'cafe',
    lat: 38.3239,
    lng: 26.7642,
    radius: 120,
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1600&auto=format&fit=crop',
    offer: {
      title: 'Kahvaltı Tabağı',
      originalPrice: 320,
      price: 260,
      currency: 'TL',
      barcode: 'NATURLA-YAKA-260',
      expiresMins: 90,
    },
  },
  {
    id: 'vourla-firin-cafe',
    name: 'Vourla Fırın Cafe',
    type: 'bakery',
    lat: 38.3236,
    lng: 26.7650,
    radius: 120,
    imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1600&auto=format&fit=crop',
    offer: {
      title: 'Kruvasan + Filtre Kahve',
      originalPrice: 190,
      price: 150,
      currency: 'TL',
      barcode: 'VOURLA-CAFE-150',
      expiresMins: 60,
    },
  },
];

// Calculate distance between two coordinates in meters
function distanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const toRad = (v: number) => (v * Math.PI) / 180;
  const R = 6371000; // Earth's radius in meters
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Request notification permission
async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission === 'denied') {
    return false;
  }

  const permission = await Notification.requestPermission();
  return permission === 'granted';
}

// Send notification for nearby offer
function sendOfferNotification(partner: typeof PARTNERS[0]) {
  const { offer } = partner;
  const body = `${partner.name}: ${offer.title} ${offer.originalPrice} ${offer.currency} yerine ${offer.price} ${offer.currency}`;
  
  new Notification('Yakınında Fırsat Var!', {
    body,
    icon: '/vite.svg',
    tag: partner.id,
  });
}

// Open Google Maps with partner location
function openGoogleMaps(partner: typeof PARTNERS[0]) {
  const url = `https://www.google.com/maps?q=${partner.lat},${partner.lng}&z=17&t=m`;
  window.open(url, '_blank');
}

function App() {
  const [locationGranted, setLocationGranted] = useState(false);
  const [notifGranted, setNotifGranted] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | null>(null);
  const [nearbyPartner, setNearbyPartner] = useState<typeof PARTNERS[0] | null>(null);
  const [showOffer, setShowOffer] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Theme colors are now fixed via CSS variables; dynamic extraction removed
  const [promptOpen, setPromptOpen] = useState(false);
  const [promptText, setPromptText] = useState<string>('');
  const [promptCategory, setPromptCategory] = useState<Array<'cafe'|'bakery'|'restaurant'>>([]);
  const [suggested, setSuggested] = useState<typeof PARTNERS>([]);
  const [routeOpen, setRouteOpen] = useState(false);
  const [routePartner, setRoutePartner] = useState<typeof PARTNERS[0] | null>(null);
  const [routePoints, setRoutePoints] = useState<Array<[number, number]>>([]); // [lat, lng]

  // Loosen types for map components to avoid strict prop issues in this setup
  const AnyMap = MapContainer as any;
  const AnyTile = TileLayer as any;
  const AnyPolyline = Polyline as any;

  // no-op: fixed theme

  // Utility to send a simple notification
  const sendSimpleNotification = useCallback((title: string, body: string) => {
    if (!('Notification' in window)) return;
    if (Notification.permission !== 'granted') return;
    new Notification(title, { body, icon: '/vite.svg' });
  }, []);

  // Compute nearest partners for given categories
  const computeSuggestions = useCallback((cats: Array<'cafe'|'bakery'|'restaurant'>) => {
    if (!currentLocation) return [] as typeof PARTNERS;
    const list = PARTNERS
      .filter(p => cats.includes(p.type as any))
      .map(p => ({ p, d: Math.round(distanceMeters(currentLocation.lat, currentLocation.lng, p.lat, p.lng)) }))
      .sort((a, b) => a.d - b.d)
      .slice(0, 3)
      .map(x => x.p);
    return list as typeof PARTNERS;
  }, [currentLocation]);

  // Time-based reminder scheduler (runs every minute)
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const minutes = now.getMinutes();
      const hour = now.getHours();

      // Helper to gate by localStorage key and window
      const shouldAsk = (key: string, periodMinutes: number) => {
        const last = parseInt(localStorage.getItem(`ask:${key}`) || '0', 10);
        const nowMs = Date.now();
        if (nowMs - last >= periodMinutes * 60 * 1000) {
          localStorage.setItem(`ask:${key}`, String(nowMs));
          return true;
        }
        return false;
      };

      // 1) Every hour: Water
      if (minutes === 0 && shouldAsk('water', 2)) {
        setPromptText('Su içtin mi?');
        setPromptCategory([]);
        setPromptOpen(true);
        sendSimpleNotification('Hatırlatma', 'Su içtin mi?');
      }

      // 2) Every 2 hours: Coffee (08:00-20:00)
      if (hour >= 8 && hour <= 20 && minutes === 0 && hour % 2 === 0 && shouldAsk('coffee', 5)) {
        setPromptText('Kahve içtin mi?');
        setPromptCategory(['cafe', 'bakery']);
        setPromptOpen(true);
        sendSimpleNotification('Kahve Zamanı', 'Kahve içtin mi? Yakında seçenekler var.');
      }

      // 3) Breakfast 07:00-10:00 (once every 3h)
      if (hour >= 7 && hour <= 10 && minutes === 0 && shouldAsk('breakfast', 180)) {
        setPromptText('Sabah kahvaltı yaptın mı?');
        setPromptCategory(['cafe', 'bakery']);
        setPromptOpen(true);
        sendSimpleNotification('Kahvaltı', 'Kahvaltı yaptın mı?');
      }

      // 4) Lunch 12:00-14:00 (once every 3h)
      if (hour >= 12 && hour <= 14 && minutes === 0 && shouldAsk('lunch', 3)) {
        setPromptText('Öğle yemeği yedin mi?');
        setPromptCategory(['restaurant', 'cafe']);
        setPromptOpen(true);
        sendSimpleNotification('Öğle Yemeği', 'Öğle yemeği yedin mi?');
      }

      // 5) Snack 15:00-17:00 (once every 2h)
      if (hour >= 15 && hour <= 17 && minutes === 0 && shouldAsk('snack', 5)) {
        setPromptText('İkindi vakti atıştırmalık ister misin?');
        setPromptCategory(['bakery', 'cafe']);
        setPromptOpen(true);
        sendSimpleNotification('Atıştırmalık', 'İkindi vakti atıştırmalık ister misin?');
      }

      // 6) Dinner 18:00-21:00 (once every 3h)
      if (hour >= 18 && hour <= 21 && minutes === 0 && shouldAsk('dinner', 2)) {
        setPromptText('Akşam yemeği yedin mi?');
        setPromptCategory(['restaurant', 'cafe']);
        setPromptOpen(true);
        sendSimpleNotification('Akşam Yemeği', 'Akşam yemeği yedin mi?');
      }
    };

    const id = window.setInterval(tick, 60 * 1000);
    // Also run immediately on mount to test
    setTimeout(tick, 500);
    return () => clearInterval(id);
  }, [sendSimpleNotification]);

  const onPromptYes = () => {
    if (promptCategory.length === 0) {
      setPromptOpen(false);
      return;
    }
    const s = computeSuggestions(promptCategory);
    setSuggested(s);
    setPromptOpen(false);
  };

  const onPromptShowSuggestions = () => {
    const s = computeSuggestions(promptCategory);
    setSuggested(s);
    setPromptOpen(false);
  };

  // Show walking route using OSRM
  const showRoute = async (partner: typeof PARTNERS[0]) => {
    if (!currentLocation) {
      openGoogleMaps(partner);
      return;
    }
    try {
      const url = `https://router.project-osrm.org/route/v1/foot/${currentLocation.lng},${currentLocation.lat};${partner.lng},${partner.lat}?overview=full&geometries=geojson`;
      const res = await fetch(url);
      const json = await res.json();
      const coords = json?.routes?.[0]?.geometry?.coordinates as Array<[number, number]> | undefined;
      if (coords && coords.length) {
        // OSRM returns [lng, lat]; convert to [lat, lng]
        const pts = coords.map(([lng, lat]) => [lat, lng] as [number, number]);
        setRoutePoints(pts);
        setRoutePartner(partner);
        setRouteOpen(true);
      } else {
        openGoogleMaps(partner);
      }
    } catch {
      openGoogleMaps(partner);
    }
  };

  // Initialize permissions and location watching
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Request notification permission
        const notifPermission = await requestNotificationPermission();
        setNotifGranted(notifPermission);

        // Request location permission and start watching
        if (navigator.geolocation) {
          const watchId = navigator.geolocation.watchPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              setCurrentLocation({ lat: latitude, lng: longitude });
              setLocationGranted(true);
              setError(null);

              // Check if user is near any partner
              const partner = PARTNERS.find(p =>
                distanceMeters(latitude, longitude, p.lat, p.lng) <= p.radius
              );

              if (partner && (!nearbyPartner || nearbyPartner.id !== partner.id)) {
                setNearbyPartner(partner);
                if (notifPermission) {
                  sendOfferNotification(partner);
                }
                setShowOffer(true);
              }
            },
            (error) => {
              console.error('Geolocation error:', error);
              setError('Konum erişimi reddedildi veya hata oluştu');
              setLocationGranted(false);
            },
            {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 60000,
            }
          );

          return () => navigator.geolocation.clearWatch(watchId);
        } else {
          setError('Bu tarayıcı konum özelliğini desteklemiyor');
        }
      } catch (err) {
        console.error('App initialization error:', err);
        setError('Uygulama başlatılırken hata oluştu');
      }
    };

    initializeApp();
  }, [nearbyPartner]);

  const handleRedeem = useCallback(() => {
    if (!nearbyPartner) return;
    
    const now = Date.now();
    const expiresAt = now + (nearbyPartner.offer.expiresMins * 60 * 1000);
    const record = { 
      partnerId: nearbyPartner.id, 
      redeemedAt: now, 
      expiresAt,
      barcode: nearbyPartner.offer.barcode 
    };
    
    localStorage.setItem(`redeem:${nearbyPartner.id}`, JSON.stringify(record));
    alert('Barkod kaydedildi! Kasa görevlisine gösteriniz.');
    setShowOffer(false);
  }, [nearbyPartner]);

  const handleCloseOffer = () => {
    setShowOffer(false);
    setNearbyPartner(null);
  };

  return (
    <div className="app">
      <header className="header">
        <h1>☕ Yakın Kampanyalar</h1>
        <p>Yakınındaki anlaşmalı işletmelerden özel fırsatları kaçırma!</p>
      </header>

      <main className="main">
        {error && (
          <div className="error">
            <p>⚠️ {error}</p>
            <button onClick={() => window.location.reload()}>
              Sayfayı Yenile
            </button>
          </div>
        )}

        {!locationGranted && !error && (
          <div className="info">
            <p>📍 Konum izni bekleniyor...</p>
          </div>
        )}

        {currentLocation && (
          <div className="location-info">
            <p>📍 Konum: {currentLocation.lat.toFixed(4)}, {currentLocation.lng.toFixed(4)}</p>
          </div>
        )}

        {nearbyPartner && (
          <div className="nearby-alert">
            <p>🎉 {nearbyPartner.name} yakınındasınız!</p>
            <button onClick={() => setShowOffer(true)}>
              Kampanyayı Görüntüle
            </button>
          </div>
        )}

        <section className="partners">
          <h2>Anlaşmalı İşletmeler</h2>
          {suggested.length > 0 && (
            <div className="info" style={{ marginBottom: 16 }}>
              <p>🎯 Önerilenler (yakınlığa göre):</p>
            </div>
          )}
          {suggested.length > 0 && (
            <div className="partner-list" style={{ marginBottom: 16 }}>
              {suggested.map(partner => (
                <div key={`sugg-${partner.id}`} className="partner-card">
                  <h3>{partner.name}</h3>
                  <button 
                    onClick={() => { setNearbyPartner(partner); setShowOffer(true); }}
                    className="view-offer-btn"
                  >
                    Kampanyayı Görüntüle
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="partner-list">
            {PARTNERS.map(partner => {
              const distance = currentLocation 
                ? Math.round(distanceMeters(currentLocation.lat, currentLocation.lng, partner.lat, partner.lng))
                : null;
              
              return (
                <div key={partner.id} className="partner-card">
                  {partner.imageUrl && (
                    <div className="partner-image-wrap">
                      <img src={partner.imageUrl} alt={partner.name} className="partner-image" loading="lazy" />
                    </div>
                  )}
                  <h3>{partner.name}</h3>
                  {distance !== null && (
                    <div 
                      className="distance-info clickable"
                      onClick={() => showRoute(partner)}
                      title="Google Haritalar'da aç"
                    >
                      <span className="distance-text">
                        {distance < 1000 
                          ? `${distance} m`
                          : `${(distance / 1000).toFixed(1)} km`
                        }
                      </span>
                    </div>
                  )}
                  <p>{partner.offer.title}</p>
                  <p className="price">
                    <span className="original-price">{partner.offer.originalPrice} {partner.offer.currency}</span>
                    <span className="arrow">→</span>
                    <span className="discount-price">{partner.offer.price} {partner.offer.currency}</span>
                  </p>
                  <button 
                    onClick={() => {
                      setNearbyPartner(partner);
                      setShowOffer(true);
                    }}
                    className="view-offer-btn"
                  >
                    Kampanyayı Görüntüle
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* Offer Modal */}
      {showOffer && nearbyPartner && (
        <div className="modal-overlay">
            <div className="modal">
            <div className="modal-header">
              <h2>🎯 Özel Kampanya</h2>
              <button onClick={handleCloseOffer} className="close-btn">×</button>
            </div>
            
            <div className="modal-content">
              <h3>{nearbyPartner.name}</h3>
                {nearbyPartner.imageUrl && (
                  <div className="modal-image-wrap">
                    <img src={nearbyPartner.imageUrl} alt={nearbyPartner.name} className="modal-image" />
                  </div>
                )}
              {currentLocation && (
                <div 
                  className="modal-distance-info clickable"
                  onClick={() => showRoute(nearbyPartner)}
                  title="Google Haritalar'da aç"
                >
                  <span className="distance-text">
                    {(() => {
                      const distance = Math.round(distanceMeters(
                        currentLocation.lat, 
                        currentLocation.lng, 
                        nearbyPartner.lat, 
                        nearbyPartner.lng
                      ));
                      return distance < 1000 
                        ? `${distance} m`
                        : `${(distance / 1000).toFixed(1)} km`;
                    })()}
                  </span>
                </div>
              )}
              <p className="offer-title">{nearbyPartner.offer.title}</p>
              
              <div className="price-section">
                <span className="original-price">{nearbyPartner.offer.originalPrice} {nearbyPartner.offer.currency}</span>
                <span className="arrow">→</span>
                <span className="discount-price">{nearbyPartner.offer.price} {nearbyPartner.offer.currency}</span>
                <span className="savings">
                  ({(nearbyPartner.offer.originalPrice - nearbyPartner.offer.price)} {nearbyPartner.offer.currency} tasarruf)
                </span>
              </div>

              <div className="qr-section">
                <p>Kasa görevlisine bu barkodu gösterin:</p>
                <div className="qr-code">
                  <QRCode value={nearbyPartner.offer.barcode} size={200} />
                </div>
                <p className="barcode-text">{nearbyPartner.offer.barcode}</p>
              </div>

              <div className="modal-actions">
                <button onClick={handleRedeem} className="redeem-btn">
                  Barkodu Kullan
                </button>
                <button onClick={handleCloseOffer} className="close-modal-btn">
                  Kapat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Route Modal */}
      {routeOpen && routePartner && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: 700 }}>
            <div className="modal-header">
              <h2>🧭 Yürüme Rotası</h2>
              <button onClick={() => setRouteOpen(false)} className="close-btn">×</button>
            </div>
            <div className="modal-content">
              <p style={{ marginBottom: 8 }}>{routePartner.name}</p>
              <div style={{ height: 400, borderRadius: 12, overflow: 'hidden' }}>
                <AnyMap center={[routePartner.lat, routePartner.lng]} zoom={16} style={{ height: '100%', width: '100%' }}>
                  <AnyTile url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  {routePoints.length > 0 && (
                    <AnyPolyline positions={routePoints} pathOptions={{ color: '#D92667', weight: 5 }} />
                  )}
                </AnyMap>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Prompt Modal */}
      {promptOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>⏰ Hatırlatma</h2>
              <button onClick={() => setPromptOpen(false)} className="close-btn">×</button>
            </div>
            <div className="modal-content">
              <p style={{ fontSize: 18, marginBottom: 12 }}>{promptText}</p>
              {promptCategory.length > 0 && (
                <div className="info" style={{ marginBottom: 12 }}>
                  <p>Cevabına göre sana yakın mekan önerebilirim.</p>
                </div>
              )}
              <div className="modal-actions">
                <button className="redeem-btn" onClick={onPromptYes}>Evet</button>
                <button className="close-modal-btn" onClick={() => setPromptOpen(false)}>Hayır</button>
                {promptCategory.length > 0 && (
                  <button className="view-offer-btn" onClick={onPromptShowSuggestions}>Önerileri Göster</button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="footer">
        <p>Yakınında kampanya olduğunda otomatik bildirim alırsınız 📱</p>
      </footer>
    </div>
  );
}

export default App;

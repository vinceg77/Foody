import React, { useEffect, useState } from 'react';
import { Clock, Package, Trash2, RefreshCw } from 'lucide-react';
import { Activity, getRecentActivities } from '../../services/activityHistory';

const getActivityIcon = (type: Activity['type']) => {
  switch (type) {
    case 'add':
      return <Package className="h-4 w-4 text-green-500" />;
    case 'remove':
      return <Trash2 className="h-4 w-4 text-red-500" />;
    case 'update':
      return <RefreshCw className="h-4 w-4 text-blue-500" />;
    default:
      return null;
  }
};

const formatTimestamp = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp;
  
  // Moins d'une minute
  if (diff < 60000) {
    return "À l'instant";
  }
  
  // Moins d'une heure
  if (diff < 3600000) {
    const minutes = Math.floor(diff / 60000);
    return `Il y a ${minutes} minute${minutes > 1 ? 's' : ''}`;
  }
  
  // Moins d'un jour
  if (diff < 86400000) {
    const hours = Math.floor(diff / 3600000);
    return `Il y a ${hours} heure${hours > 1 ? 's' : ''}`;
  }
  
  // Plus d'un jour
  const days = Math.floor(diff / 86400000);
  return `Il y a ${days} jour${days > 1 ? 's' : ''}`;
};

export const RecentActivity: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadActivities = async () => {
      try {
        const recentActivities = await getRecentActivities();
        setActivities(recentActivities);
      } catch (error) {
        console.error('Erreur lors du chargement des activités:', error);
      } finally {
        setLoading(false);
      }
    };

    loadActivities();
    
    // Rafraîchir les activités toutes les 30 secondes
    const interval = setInterval(loadActivities, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Activité récente</h3>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="h-12 bg-gray-100 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Activité récente</h3>
      {activities.length > 0 ? (
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center py-2 border-b border-gray-100 last:border-0">
              <div className="p-2 bg-gray-50 rounded-full">
                {getActivityIcon(activity.type)}
              </div>
              <div className="ml-3 flex-1">
                <p className="text-gray-600">{activity.description}</p>
                <p className="text-sm text-gray-400 flex items-center mt-1">
                  <Clock className="h-3 w-3 mr-1" />
                  {formatTimestamp(activity.timestamp)}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 py-4">
          Aucune activité récente
        </p>
      )}
    </div>
  );
};
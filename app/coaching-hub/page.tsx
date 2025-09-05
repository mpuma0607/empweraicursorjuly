'use client';

import { useState } from 'react';
import { Play, X } from 'lucide-react';

interface Expert {
  id: string;
  name: string;
  title: string;
  image: string;
  playlistUrl: string;
}

const coachingSections = {
  realEstate: {
    title: "Real Estate Coaching",
    experts: [
      {
        id: "tom-ferry",
        name: "Tom Ferry",
        title: "Real Estate Coach",
        image: "/images/tom-ferry.png",
        playlistUrl: "https://youtube.com/playlist?list=PLlnz4BpiHqRGMPpHTkuKCcFbviQyVHgEK&si=eVRdzErmtzM3yXEs"
      },
      {
        id: "brian-buffini",
        name: "Brian Buffini",
        title: "Real Estate Coach",
        image: "/images/brian-buffini.png",
        playlistUrl: "https://youtube.com/playlist?list=PLkXs4sHmjm5gl1qnuVwKFSzvRCKy6twef&si=V4cyxYmgMEJXpPXL"
      },
      {
        id: "greg-harrelson",
        name: "Greg Harrelson",
        title: "Real Estate Coach",
        image: "/images/greg-harrelson.png",
        playlistUrl: "https://youtube.com/playlist?list=PL39MvnclUoxle-o_Z7rB85-eUqBa6sjsr&si=OwkJRvyIDfCMk4gJ"
      },
      {
        id: "ninja-selling",
        name: "Ninja Selling",
        title: "Real Estate Training",
        image: "/images/ninja-selling.png",
        playlistUrl: "https://youtube.com/playlist?list=PLwXJJCN3EXjoi4EA-LYzvmSbxPAcjQo7D&si=4AtsEQick-FjdXhX"
      }
    ]
  },
  mindset: {
    title: "Mindset Mastery",
    experts: [
      {
        id: "matthew-ferry",
        name: "Matthew Ferry",
        title: "Mindset Coach",
        image: "/images/matthew-ferry.png",
        playlistUrl: "https://youtube.com/playlist?list=PL1X8XNQ8DVArqeoHyG7SDfsCk8utr_OO7&si=kmlelBS90o16kATG"
      },
      {
        id: "tony-robbins",
        name: "Tony Robbins",
        title: "Life Coach",
        image: "/images/tony-robbins.png",
        playlistUrl: "https://youtube.com/playlist?list=PLYTXvUDQT5pWkFiK1Yal1WtPcMrVbmjzA&si=g2mXL4mJ3Aar1z0k"
      },
      {
        id: "david-goggins",
        name: "David Goggins",
        title: "Mental Toughness Coach",
        image: "/images/david-goggins.png",
        playlistUrl: "https://youtube.com/playlist?list=PLTaMkgKv5vlza7KP6-3ZbdWItiC_vk0Pq&si=KK3c2CwgErYxB2C7"
      },
      {
        id: "jim-kwik",
        name: "Jim Kwik",
        title: "Memory & Learning Coach",
        image: "/images/jim-kwik.png",
        playlistUrl: "https://youtube.com/playlist?list=PLwf_ceM-L-lOhmoyl0Qe2O1zLL9qOkBR0&si=q65Qx7_zxsbyhF8L"
      }
    ]
  },
  negotiation: {
    title: "Negotiation Mastery",
    experts: [
      {
        id: "chris-voss",
        name: "Chris Voss",
        title: "Negotiation Expert",
        image: "/images/chris-voss.png",
        playlistUrl: "https://youtube.com/playlist?list=PL_3ZK0x5nFYBNLNoUnm0FxZCUyqPmXccf&si=WHnuKmbGKOOqdZbH"
      },
      {
        id: "chase-hughes",
        name: "Chase Hughes",
        title: "Negotiation Expert",
        image: "/images/chase-hughes.png",
        playlistUrl: "https://youtube.com/playlist?list=PLZP7HY0OuQVw_o1roMxKe7FA3zAH6eYrv&si=V1v5n8BY8Q_C8Fr0"
      }
    ]
  },
  motivation: {
    title: "Motivation Mastery",
    experts: [
      {
        id: "greatest-motivational",
        name: "The Greatest Motivational Speakers",
        title: "Motivation Collection",
        image: "/images/motivational-speakers.png",
        playlistUrl: "https://youtube.com/playlist?list=PLriLgVg0-Kgzu0Y-Rz2ofUT1E53lUjh_T&si=bL5r-E2ByZ3Fv4SE"
      }
    ]
  },
  socialMedia: {
    title: "Social Media/Marketing Mastery",
    experts: [
      {
        id: "gary-vee",
        name: "Gary Vee",
        title: "Marketing Expert",
        image: "/images/gary-vee.png",
        playlistUrl: "https://youtube.com/playlist?list=PLfA33-E9P7FBieOyNGQO5auhB5SrPNXBc&si=EYgD6um9v-53QumO"
      },
      {
        id: "alex-hormozi",
        name: "Alex Hormozi",
        title: "Business & Marketing Expert",
        image: "/images/alex-hormozi.png",
        playlistUrl: "https://youtube.com/playlist?list=PLjkaUn6QNTZSwJbzAIRSDN_2IKInKEaUe&si=TA-K8cm7MhpMjYqy"
      }
    ]
  }
};

export default function CoachingHub() {
  const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null);

  const openModal = (expert: Expert) => {
    if (expert.playlistUrl) {
      setSelectedExpert(expert);
    }
  };

  const closeModal = () => {
    setSelectedExpert(null);
  };

  const getPlaylistId = (url: string) => {
    const match = url.match(/[?&]list=([^&]+)/);
    return match ? match[1] : '';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Coaching Hub
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Learn from the world's leading experts in real estate, mindset, negotiation, 
              motivation, and marketing. Access curated YouTube playlists from top coaches 
              and thought leaders all in one place.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {Object.entries(coachingSections).map(([key, section]) => (
          <div key={key} className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              {section.title}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {section.experts.map((expert) => (
                <div
                  key={expert.id}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer group"
                  onClick={() => openModal(expert)}
                >
                  <div className="aspect-square relative overflow-hidden rounded-t-lg">
                    <img
                      src={expert.image}
                      alt={expert.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                      <Play className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {expert.name}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {expert.title}
                    </p>
                    {!expert.playlistUrl && (
                      <p className="text-yellow-600 text-xs mt-2">
                        Playlist coming soon
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedExpert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-2xl font-bold text-gray-900">
                Learn From {selectedExpert.name}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="aspect-video">
                <iframe
                  src={`https://www.youtube.com/embed/videoseries?list=${getPlaylistId(selectedExpert.playlistUrl)}`}
                  title={`${selectedExpert.name} Playlist`}
                  className="w-full h-full rounded-lg"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

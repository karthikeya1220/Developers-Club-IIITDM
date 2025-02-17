"use client";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "../../../components/ui/dialog";
import { Card, CardContent } from "../../../components/ui/card";
import useEmblaCarousel from 'embla-carousel-react'
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Link as LinkIcon,
  ArrowRight,
  ChevronLeft, ChevronRight
} from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { useCallback, useEffect, useState } from "react";
import  Loader  from "../../(components)/Loader.jsx";

const formatDate = (dateString) => {
  const date = new Date(dateString)
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

const formatTime = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

const getEventStatus = (date) => {
  const eventDate = new Date(date)
  const today = new Date()
  const daysUntil = Math.ceil((eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  if (daysUntil <= 7) return { text: 'Coming Soon', color: 'bg-red-500' }
  if (daysUntil <= 14) return { text: '2 Weeks Left', color: 'bg-yellow-500' }
  return { text: 'TBA', color: 'bg-green-500' }
}

const EventCard = ({ event, index }) => {
  const status = getEventStatus(event.date)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <Card className="h-full cursor-pointer bg-white hover:shadow-lg transition-shadow duration-300 relative overflow-hidden group">
            <div className="absolute top-4 right-4">
              <Badge className={`bg-red-500 text-white px-3 py-1 hover:bg-red-600`}>
                {status.text}
              </Badge>
            </div>
            <CardContent className="p-6 pt-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 pr-20 leading-tight">
                {event.Event_name}
              </h3>
              <div className="space-y-4 text-gray-600">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 mr-3 text-blue-500 flex-shrink-0" />
                  <span className="text-sm">{formatDate(event.date)}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-5 h-5 mr-3 text-blue-500 flex-shrink-0" />
                  <span className="text-sm">{formatTime(event.date)}</span>
                </div>
                {event.location && (
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 mr-3 text-blue-500 flex-shrink-0" />
                    <span className="text-sm">{event.location}</span>
                  </div>
                )}
              </div>
              <div className="mt-6 flex items-center text-sm text-blue-500 group-hover:text-blue-600 transition-colors">
                <span>View Details</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] max-h-[700px] bg-white">
        <div className="p-8">
          <div className="flex justify-between items-start mb-8">
            <h2 className="text-2xl font-bold leading-tight pr-4">
              {event.Event_name}
            </h2>
            <div className={`${status.color} text-white px-3 font-semibold py-1 hover:${status.color}`}>
              {status.text}
            </div>
          </div>
          <div className="space-y-6">
            <div className="flex items-start text-gray-600">
              <Calendar className="w-5 h-5 mr-4 text-blue-500 flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold mb-1">Date</p>
                <p>{formatDate(event.date)}</p>
              </div>
            </div>
            <div className="flex items-start text-gray-600">
              <Clock className="w-5 h-5 mr-4 text-blue-500 flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold mb-1">Time</p>
                <p>{formatTime(event.date)}</p>
              </div>
            </div>
            {event.location && (
              <div className="flex items-start text-gray-600">
                <MapPin className="w-5 h-5 mr-4 text-blue-500 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold mb-1">Venue</p>
                  <p>{event.location}</p>
                </div>
              </div>
            )}
            {event.capacity && (
              <div className="flex items-start text-gray-600">
                <Users className="w-5 h-5 mr-4 text-blue-500 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold mb-1">Capacity</p>
                  <p>{event.capacity} participants</p>
                </div>
              </div>
            )}
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="font-semibold mb-3">Description</p>
              <p className="text-gray-600 leading-relaxed">
                {event.Project_Discription}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function EventsSection({ events }) {
  // Initialize all hooks at the top level
  const [isLoading, setIsLoading] = useState(true);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, align: 'start' });
  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);

  // Callbacks
  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setPrevBtnEnabled(emblaApi.canScrollPrev());
    setNextBtnEnabled(emblaApi.canScrollNext());
  }, [emblaApi]);

  // Effects
  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    return () => emblaApi.off('select', onSelect); // Cleanup
  }, [emblaApi, onSelect]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [events]);

  if (isLoading) {
    return <Loader className="my-8" />;
  }

  if (!events || events.length === 0) {
    return (
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Upcoming Events</h2>
        <div className="p-8 bg-white rounded-lg shadow-md text-center">
          <p className="text-gray-600">No upcoming events found.</p>
        </div>
      </motion.section>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-12 relative"
    >
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Upcoming Events
      </h2>
      <div className="relative">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {events.map((event, index) => (
              <motion.div
                key={event.id || index}
                className="flex-[0_0_100%] min-w-0 sm:flex-[0_0_50%] lg:flex-[0_0_33.33%] pl-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <EventCard event={event} index={index} />
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Navigation Buttons */}
        <NavigationButton
          direction="prev"
          onClick={scrollPrev}
          disabled={!prevBtnEnabled}
        />
        <NavigationButton
          direction="next"
          onClick={scrollNext}
          disabled={!nextBtnEnabled}
        />
      </div>
    </motion.section>
  );
}

// Separate Navigation Button Component
const NavigationButton = ({ direction, onClick, disabled }) => (
  <motion.button
    onClick={onClick}
    disabled={disabled}
    className={`absolute ${direction === 'prev' ? 'left-0' : 'right-0'} 
               top-1/2 transform -translate-y-1/2 p-2 rounded-full 
               bg-blue-500 text-white hover:bg-blue-600 
               transition-colors z-10 disabled:opacity-50`}
    aria-label={`${direction === 'prev' ? 'Previous' : 'Next'} slide`}
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
  >
    {direction === 'prev' ? <ChevronLeft className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
  </motion.button>
);


"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Cloud,
  Droplets,
  Sun,
  Thermometer,
  Wind,
  AlertTriangle,
} from "lucide-react";
import {
  getLocationByZip,
  getWeatherData,
  getWeatherWarnings,
  type Location,
  type WeatherData,
} from "@/lib/weather-api";

export function WeatherWidget() {
  const [location, setLocation] = useState<Location | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [zipCode, setZipCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load saved location from localStorage
    const savedLocation = localStorage.getItem("gardenLocation");
    if (savedLocation) {
      setLocation(JSON.parse(savedLocation));
    }
  }, []);

  useEffect(() => {
    async function fetchWeather() {
      if (location) {
        try {
          const data = await getWeatherData(location.lat, location.lon);
          setWeather(data);
          setWarnings(getWeatherWarnings(data));
        } catch (error) {
          console.error("Error fetching weather:", error);
          setError("Failed to fetch weather data");
        }
      }
    }

    if (location) {
      fetchWeather();
      // Update weather every 30 minutes
      const interval = setInterval(fetchWeather, 30 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [location]);

  const handleSetLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const newLocation = await getLocationByZip(zipCode);
      setLocation(newLocation);
      localStorage.setItem("gardenLocation", JSON.stringify(newLocation));
      setZipCode("");
    } catch (error) {
      setError("Invalid zip code");
    } finally {
      setIsLoading(false);
    }
  };

  if (!location) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Set Your Garden Location</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSetLocation} className="space-y-4">
            <div className="flex space-x-2">
              <Input
                placeholder="Enter ZIP code"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                pattern="[0-9]{5}"
                maxLength={5}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Loading..." : "Set Location"}
              </Button>
            </div>
            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
          </form>
        </CardContent>
      </Card>
    );
  }

  if (!weather) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <Cloud className="animate-pulse h-6 w-6 text-muted-foreground" />
            <span className="ml-2">Loading weather data...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Weather in {location.name}</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setLocation(null);
            localStorage.removeItem("gardenLocation");
          }}
        >
          Change Location
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-center space-x-2">
            <Thermometer className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Temperature</p>
              <p className="text-2xl">{Math.round(weather.temp)}°F</p>
              <p className="text-xs text-muted-foreground">
                Feels like {Math.round(weather.feels_like)}°F
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Droplets className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Humidity</p>
              <p className="text-2xl">{weather.humidity}%</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Sun className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">UV Index</p>
              <p className="text-2xl">{weather.uvi}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Wind className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Wind Speed</p>
              <p className="text-2xl">{Math.round(weather.wind_speed)} mph</p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <img
            src={`http://openweathermap.org/img/wn/${weather.icon}@2x.png`}
            alt={weather.description}
            className="w-10 h-10"
          />
          <p className="text-sm capitalize">{weather.description}</p>
        </div>

        {warnings.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              <h4 className="font-medium">Weather Warnings</h4>
            </div>
            <div className="space-y-2">
              {warnings.map((warning, index) => (
                <Alert key={index}>
                  <AlertDescription>{warning}</AlertDescription>
                </Alert>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
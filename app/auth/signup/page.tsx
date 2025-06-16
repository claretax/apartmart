"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Loader2, Eye, EyeOff } from "lucide-react";

export default function SignupPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [tower, setTower] = useState("");
  const [floor, setFloor] = useState("");
  const [flatNumber, setFlatNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          email,
          password,
          apartmentDetails: { tower, floor, flatNumber },
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess("Account created! You may now log in.");
        setTimeout(() => router.push("/auth/login"), 1500);
      } else {
        setError(data.message || "Signup failed");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900">
      <div className="w-full max-w-md p-8 rounded-lg shadow-xl bg-white/10 border border-white/10">
        <h2 className="text-2xl font-bold mb-6 text-white text-center">Sign Up</h2>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="username" className="text-white">Username</Label>
            <Input id="username" value={username} onChange={e => setUsername(e.target.value)} required autoFocus className="mt-1" />
          </div>
          <div>
            <Label htmlFor="email" className="text-white">Email</Label>
            <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required className="mt-1" />
          </div>
          <div>
            <Label htmlFor="password" className="text-white">Password</Label>
            <div className="relative">
              <Input id="password" type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} required className="mt-1 pr-10" />
              <Button type="button" size="icon" variant="ghost" className="absolute right-2 top-2 text-white/70 hover:text-white" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          <div className="flex space-x-2">
            <div>
              <Label htmlFor="tower" className="text-white">Tower</Label>
              <Input id="tower" value={tower} onChange={e => setTower(e.target.value)} required className="mt-1" />
            </div>
            <div>
              <Label htmlFor="floor" className="text-white">Floor</Label>
              <Input id="floor" value={floor} onChange={e => setFloor(e.target.value)} required className="mt-1" />
            </div>
            <div>
              <Label htmlFor="flatNumber" className="text-white">Flat #</Label>
              <Input id="flatNumber" value={flatNumber} onChange={e => setFlatNumber(e.target.value)} required className="mt-1" />
            </div>
          </div>
          {error && <div className="text-red-400 text-sm">{error}</div>}
          {success && <div className="text-green-400 text-sm">{success}</div>}
          <Button type="submit" className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white border-0" disabled={isLoading}>
            {isLoading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing up...</>) : "Sign Up"}
          </Button>
        </form>
        <div className="mt-6 text-center">
          <span className="text-white/60">Already have an account?</span>
          <a href="/auth/login" className="ml-2 text-emerald-300 hover:underline">Sign In</a>
        </div>
      </div>
    </div>
  );
}

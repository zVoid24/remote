import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { specialistApi } from '@/api/specialists';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft, Check, Star, Shield } from 'lucide-react';

export default function SpecialistDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ['specialist', id],
    queryFn: () => specialistApi.getById(id!),
    enabled: !!id,
  });

  const specialist = data?.data;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!specialist) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Service Not Found</h1>
        <Button onClick={() => navigate('/marketplace')}>Back to Marketplace</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/marketplace')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-semibold">Service Details</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Image */}
            <div className="aspect-video rounded-xl overflow-hidden bg-muted relative">
              {specialist.media && specialist.media.length > 0 ? (
                <img 
                  src={specialist.media[0].url} 
                  alt={specialist.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-secondary/50">
                  <span className="text-muted-foreground font-medium">No Image Available</span>
                </div>
              )}
            </div>

            {/* Title & Description */}
            <div className="space-y-4">
              <h1 className="text-3xl font-bold">{specialist.title}</h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  <span className="font-medium text-foreground">New</span>
                  <span>(0 reviews)</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Shield className="h-4 w-4" />
                  <span>Verified Specialist</span>
                </div>
              </div>
              <div className="prose max-w-none">
                <h3 className="text-lg font-semibold mb-2">About this service</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">{specialist.description}</p>
              </div>
            </div>

            {/* Additional Offerings */}
            {specialist.serviceOfferings && specialist.serviceOfferings.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">What's included</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {specialist.serviceOfferings.map((offering: any) => (
                    <div key={offering.id} className="flex items-start gap-3 p-3 rounded-lg border bg-card">
                      <Check className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">{offering.serviceOfferingMasterList?.title}</p>
                        <p className="text-xs text-muted-foreground">{offering.serviceOfferingMasterList?.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Specialist Profile */}
            <div className="border-t pt-8">
              <h3 className="text-lg font-semibold mb-4">About the Specialist</h3>
              <div className="flex items-start gap-4 p-4 rounded-xl bg-muted/30">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                  GL
                </div>
                <div>
                  <h4 className="font-medium">Gwen Lam</h4>
                  <p className="text-sm text-muted-foreground">Company Secretary • ST Comp Holdings Sdn Bhd</p>
                  <p className="text-sm mt-2">
                    Professional company secretary with over 10 years of experience in corporate compliance and governance.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-xl border bg-card p-6 shadow-sm space-y-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Starting from</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold">RM {parseFloat(specialist.base_price).toLocaleString()}</span>
                  <span className="text-muted-foreground">/ package</span>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Duration</span>
                  <span className="font-medium">{specialist.duration_days} Days</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Service Fee</span>
                  <span className="font-medium">RM {parseFloat(specialist.platform_fee).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm pt-2 border-t font-medium">
                  <span>Total</span>
                  <span>RM {parseFloat(specialist.final_price).toLocaleString()}</span>
                </div>
              </div>

              <Button className="w-full" size="lg">Book Now</Button>
              <p className="text-xs text-center text-muted-foreground">
                You won't be charged yet
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

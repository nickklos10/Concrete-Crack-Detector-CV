import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Clock, Heart, Info } from "lucide-react";

interface WelcomePopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WelcomePopup({ isOpen, onClose }: WelcomePopupProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={() => {}}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
              <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <AlertDialogTitle className="text-left">
                Welcome to Concrete Crack Detector
              </AlertDialogTitle>
              <Badge variant="secondary" className="text-xs mt-1">
                Free Project
              </Badge>
            </div>
          </div>
        </AlertDialogHeader>

        <Separator />

        <AlertDialogDescription className="text-left space-y-3 py-2">
          
          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-amber-900 dark:text-amber-100 mb-1">
                  First-time notice
                </p>
                <p className="text-amber-800 dark:text-amber-200">
                  The first analysis may take 30-60 seconds as the free server I am using for this project wakes up. If it takes longer than 60 seconds, please retry with a new analysis and it will work.
                  Subsequent analyses will be much faster!
                </p>
              </div>
            </div>
          </div>

        </AlertDialogDescription>

        <Separator />

        <AlertDialogFooter>
          <AlertDialogAction onClick={onClose} className="w-full">
            Got it, let&apos;s start!
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
} 
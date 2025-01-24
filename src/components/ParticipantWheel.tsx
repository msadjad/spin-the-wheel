import { useEffect, useRef, useCallback } from "react";
import { Person } from "../types";

interface ParticipantWheelProps {
  participants: Person[];
  selectedParticipant: Person | null;
  onSpinEnd?: () => void;
}

const COLORS = [
  "#EC4899",
  "#8B5CF6",
  "#6366F1",
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#F97316",
  "#82CA9D",
  "#34D399",
  "#0EA5E9",
  "#818CF8",
  "#A78BFA",
  "#F472B6",
  "#FBBF24",
  "#34D399",
  "#0EA5E9",
  "#818CF8",
  "#A78BFA",
  "#F472B6",
  "#FBBF24",
];
const TWO_PI = 2 * Math.PI;
const FRICTION = 0.991;
const INITIAL_VELOCITY = 0.35;

export function ParticipantWheel({
  participants,
  selectedParticipant,
  onSpinEnd,
}: ParticipantWheelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestAnimationFrameRef = useRef<number>();
  const angleRef = useRef(0);
  const velocityRef = useRef(0);
  const isSpinningRef = useRef(false);

  const drawParticipant = useCallback(
    (ctx: CanvasRenderingContext2D, participant: Person, index: number) => {
      const totalParticipants = participants.length;
      const sectionArcSize = TWO_PI / totalParticipants;
      const startAngle = sectionArcSize * index;
      const radius = ctx.canvas.width / 2;
      const originX = radius;
      const originY = radius;

      ctx.save();

      // Draw colored sector
      ctx.beginPath();
      ctx.moveTo(originX, originY);
      ctx.arc(
        originX,
        originY,
        radius - 10,
        startAngle,
        startAngle + sectionArcSize
      );
      ctx.lineTo(originX, originY);
      ctx.fillStyle = COLORS[index % COLORS.length];
      ctx.fill();

      // Draw the participant's name
      ctx.translate(originX, originY);
      ctx.rotate(startAngle + sectionArcSize / 2);
      ctx.textAlign = "center";
      ctx.fillStyle = "white";
      ctx.font = "bold 14px Arial";
      const textRadius = radius * 0.5; // Position text 75% from center to edge
      ctx.fillText(participant.name, textRadius, 0);

      ctx.restore();
    },
    [participants]
  );

  const drawWheel = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear previous frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    participants.forEach((participant, index) =>
      drawParticipant(ctx, participant, index)
    );

    canvas.style.transform = `rotate(${angleRef.current - Math.PI / 2}rad)`;
  }, [participants, drawParticipant]);

  const getTargetAngle = useCallback(() => {
    if (!selectedParticipant) {
      return 0;
    }

    const participantIndex = participants.findIndex(
      (p) => p.id === selectedParticipant.id
    );

    if (participantIndex === -1) {
      return 0;
    }

    const eachParticipantAngle = TWO_PI / participants.length;
    const fiveRotations = 5 * TWO_PI;
    const angleToTarget =
      (participants.length - participantIndex - 0.5) * eachParticipantAngle;

    return fiveRotations + angleToTarget;
  }, [participants, selectedParticipant]);

  const animate = useCallback(() => {
    // Stop animation if wheel is nearly stopped
    if (!isSpinningRef.current && velocityRef.current < 0.002) {
      velocityRef.current = 0;
      if (onSpinEnd && selectedParticipant) {
        onSpinEnd();
      }
      return;
    }

    // Calculate new velocity based on distance to target
    const targetAngle = getTargetAngle();
    if (angleRef.current < targetAngle) {
      velocityRef.current = FRICTION * (targetAngle - angleRef.current) * 0.05;
    } else {
      velocityRef.current = 0;
    }

    // Update angle and redraw
    angleRef.current += velocityRef.current;
    drawWheel();
    requestAnimationFrameRef.current = requestAnimationFrame(animate);
  }, [drawWheel, selectedParticipant, onSpinEnd, getTargetAngle]);

  // Effect to handle starting and stopping the spin
  useEffect(() => {
    if (!isSpinningRef.current && selectedParticipant) {
      isSpinningRef.current = true;
      angleRef.current = 0;
      velocityRef.current = INITIAL_VELOCITY;
      if (requestAnimationFrameRef.current) {
        cancelAnimationFrame(requestAnimationFrameRef.current);
      }
      requestAnimationFrameRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (isSpinningRef.current) {
        isSpinningRef.current = false;
      }
    };
  }, [animate, selectedParticipant]);

  // Effect to initialize and cleanup the canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    canvas.width = 256;
    canvas.height = 256;
    drawWheel();

    return () => {
      if (requestAnimationFrameRef.current) {
        cancelAnimationFrame(requestAnimationFrameRef.current);
      }
    };
  }, [drawWheel]);

  return (
    <div className="relative w-64 h-64 mx-auto">
      <canvas ref={canvasRef} className="rounded-full" />
      {/* Triangle pointer indicating selected sector */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-8 h-8">
        <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[16px] border-t-indigo-500 mx-auto" />
      </div>
    </div>
  );
}

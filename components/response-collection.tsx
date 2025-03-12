"use client";

import { useState, useEffect, useRef } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

interface ResponseCollectionProps {
  nodeId: string;
  nodeData: any;
  updateNodeData: (nodeId: string, data: any) => void;
  isActive?: boolean;
  onResponseCollected?: (response: { nodeId: string, responseTime: number, value: string }) => void;
}

export function ResponseCollection({ 
  nodeId, 
  nodeData, 
  updateNodeData, 
  isActive = false,
  onResponseCollected 
}: ResponseCollectionProps) {
  const [collectResponse, setCollectResponse] = useState(nodeData.collectResponse || false);
  const [responseType, setResponseType] = useState(nodeData.responseType || "keyboard");
  const [responseTimeout, setResponseTimeout] = useState(nodeData.responseTimeout || 3000);
  const [validResponses, setValidResponses] = useState(nodeData.validResponses || "");
  
  // For response time measurement
  const [startTime, setStartTime] = useState<number | null>(null);
  const responseTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setCollectResponse(nodeData.collectResponse || false);
    setResponseType(nodeData.responseType || "keyboard");
    setResponseTimeout(nodeData.responseTimeout || 3000);
    setValidResponses(nodeData.validResponses || "");
  }, [nodeData.collectResponse, nodeData.responseType, nodeData.responseTimeout, nodeData.validResponses]);

  // Start measuring response time when the node becomes active
  useEffect(() => {
    if (isActive && collectResponse) {
      setStartTime(Date.now());
      
      // Set up response timeout if specified
      if (responseTimeout > 0) {
        responseTimeoutRef.current = setTimeout(() => {
          handleResponse('timeout');
        }, responseTimeout);
      }
      
      return () => {
        if (responseTimeoutRef.current) {
          clearTimeout(responseTimeoutRef.current);
          responseTimeoutRef.current = null;
        }
      };
    }
  }, [isActive, collectResponse, responseTimeout]);

  // Handle keyboard responses
  useEffect(() => {
    if (!isActive || !collectResponse || responseType !== 'keyboard') return;
    
    const validKeysList = validResponses ? 
      validResponses.split(',').map(key => key.trim()) : 
      [];
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (validKeysList.length === 0 || validKeysList.includes(e.key)) {
        handleResponse(e.key);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isActive, collectResponse, responseType, validResponses]);

  // Handle mouse/touch responses
  useEffect(() => {
    if (!isActive || !collectResponse || (responseType !== 'mouse' && responseType !== 'touch')) return;
    
    const handleClick = (e: MouseEvent | TouchEvent) => {
      // For mouse clicks, we could also record the coordinates
      const x = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
      const y = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;
      handleResponse(`${x},${y}`);
    };
    
    if (responseType === 'mouse') {
      window.addEventListener('click', handleClick as EventListener);
    } else {
      window.addEventListener('touchstart', handleClick as EventListener);
    }
    
    return () => {
      if (responseType === 'mouse') {
        window.removeEventListener('click', handleClick as EventListener);
      } else {
        window.removeEventListener('touchstart', handleClick as EventListener);
      }
    };
  }, [isActive, collectResponse, responseType]);

  const handleResponse = (value: string) => {
    if (!startTime || !isActive || !collectResponse) return;
    
    const responseTime = Date.now() - startTime;
    
    if (onResponseCollected) {
      onResponseCollected({
        nodeId,
        responseTime,
        value
      });
    }
    
    // Clear any pending timeout
    if (responseTimeoutRef.current) {
      clearTimeout(responseTimeoutRef.current);
      responseTimeoutRef.current = null;
    }
  };

  const handleResponseTypeChange = (value: string) => {
    setResponseType(value);
    updateNodeData(nodeId, { responseType: value });
  };

  const handleTimeoutChange = (value: number[]) => {
    setResponseTimeout(value[0]);
    updateNodeData(nodeId, { responseTimeout: value[0] });
  };

  const handleValidResponsesChange = (value: string) => {
    setValidResponses(value);
    updateNodeData(nodeId, { validResponses: value });
  };

  return (
    <div className="space-y-4 border-t pt-4 mt-4">
      <div className="flex items-center space-x-2">
        <Switch
          id={`collectResponse-${nodeId}`}
          checked={collectResponse}
          onCheckedChange={(checked) => {
            setCollectResponse(checked);
            updateNodeData(nodeId, { collectResponse: checked });
          }}
        />
        <Label htmlFor={`collectResponse-${nodeId}`}>Collect Response</Label>
      </div>

      {collectResponse && (
        <>
          <div className="space-y-2">
            <Label htmlFor={`responseType-${nodeId}`}>Response Type</Label>
            <Select
              value={responseType}
              onValueChange={handleResponseTypeChange}
            >
              <SelectTrigger id={`responseType-${nodeId}`}>
                <SelectValue placeholder="Select response type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="keyboard">Keyboard</SelectItem>
                <SelectItem value="mouse">Mouse Click</SelectItem>
                <SelectItem value="touch">Touch</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor={`responseTimeout-${nodeId}`}>Response Timeout (ms): {responseTimeout}</Label>
            <Slider
              id={`responseTimeout-${nodeId}`}
              value={[responseTimeout]}
              min={500}
              max={10000}
              step={500}
              onValueChange={handleTimeoutChange}
              className="mt-2"
            />
          </div>

          {responseType === "keyboard" && (
            <div className="space-y-2">
              <Label htmlFor={`validResponses-${nodeId}`}>Valid Keys (comma separated)</Label>
              <Input
                id={`validResponses-${nodeId}`}
                value={validResponses}
                onChange={(e) => handleValidResponsesChange(e.target.value)}
                placeholder="e.g. ArrowLeft, ArrowRight, Space"
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
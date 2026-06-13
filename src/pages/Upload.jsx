import React, { useState, useRef, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { 
  Upload as UploadIcon, 
  FileAudio, 
  Mic, 
  Sparkles, 
  ArrowLeft,
  AudioWaveform,
  Brain,
  Clock
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

import FileUploadZone from "../components/upload/FileUploadZone";
import ProcessingStatus from "../components/upload/ProcessingStatus";
import AudioPreview from "../components/upload/AudioPreview";

export default function UploadPage() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processingStep, setProcessingStep] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [audioUrl, setAudioUrl] = useState('');
  const [extractedData, setExtractedData] = useState(null);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    const audioFile = droppedFiles.find(file => 
      file.type.startsWith("audio/") || 
      file.name.toLowerCase().endsWith('.mp3') ||
      file.name.toLowerCase().endsWith('.wav') ||
      file.name.toLowerCase().endsWith('.m4a')
    );

    if (audioFile) {
      setFile(audioFile);
      setAudioUrl(URL.createObjectURL(audioFile));
    } else {
      setError("Please upload an audio file (MP3, WAV, M4A)");
    }
  }, []);

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setAudioUrl(URL.createObjectURL(selectedFile));
      setError(null);
    }
  };

  const processAudio = async () => {
    if (!file) return;

    setIsProcessing(true);
    setUploadProgress(0);
    setError(null);

    try {
      // Step 1: Upload file
      setProcessingStep('Uploading audio file...');
      setUploadProgress(20);
      
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      
      // Step 2: AI Analysis
      setProcessingStep('AI analyzing audio content...');
      setUploadProgress(40);
      
      const analysisResult = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze this podcast audio file and extract metadata. Listen for the best moments that would make engaging social media clips. Provide suggestions for clip titles, optimal segments for audiogram creation, and key talking points.`,
        file_urls: [file_url],
        response_json_schema: {
          type: "object",
          properties: {
            title: { type: "string" },
            duration: { type: "number" },
            suggested_clips: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  start_time: { type: "number" },
                  end_time: { type: "number" },
                  title: { type: "string" },
                  description: { type: "string" },
                  engagement_score: { type: "number" }
                }
              }
            },
            transcript_preview: { type: "string" },
            content_themes: {
              type: "array",
              items: { type: "string" }
            }
          }
        }
      });

      // Step 3: Generate waveform data (simulated)
      setProcessingStep('Generating waveform visualization...');
      setUploadProgress(70);
      
      const waveformData = Array.from({ length: 100 }, () => Math.random() * 100);

      // Step 4: Create audiogram record
      setProcessingStep('Creating audiogram...');
      setUploadProgress(90);
      
      const audiogramData = {
        title: analysisResult.title || file.name.replace(/\.[^/.]+$/, ""),
        original_file_url: file_url,
        duration: analysisResult.duration || 30,
        waveform_data: waveformData,
        transcript: analysisResult.transcript_preview || "",
        status: "ready",
        style_config: {
          background_color: "#1e1b4b",
          waveform_color: "#8b5cf6", 
          text_color: "#ffffff",
          font_family: "Inter",
          template: "modern"
        }
      };

      const newAudiogram = await base44.entities.Audiogram.create(audiogramData);
      setExtractedData({ ...analysisResult, audiogram: newAudiogram });
      setUploadProgress(100);
      setProcessingStep('Complete!');

    } catch (error) {
      setError("Error processing audio file. Please try again.");
      console.error("Processing error:", error);
    }

    setIsProcessing(false);
  };

  const handleCreateAudiogram = () => {
    if (extractedData?.audiogram) {
      navigate(createPageUrl("Editor") + "?id=" + extractedData.audiogram.id);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate(createPageUrl("Dashboard"))}
              className="border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-white">Create Audiogram</h1>
              <p className="text-slate-400">Upload your podcast and let AI create engaging clips</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {error && (
          <Alert className="mb-6 border-red-500/20 bg-red-500/10">
            <AlertDescription className="text-red-400">{error}</AlertDescription>
          </Alert>
        )}

        {!isProcessing && !extractedData && (
          <>
            {/* Upload Section */}
            <Card className="bg-slate-900/50 backdrop-blur border-slate-800 mb-8">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <UploadIcon className="w-5 h-5 text-purple-400" />
                  Upload Your Podcast
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className="mb-6"
                >
                  <FileUploadZone 
                    onFileSelect={handleFileSelect}
                    dragActive={dragActive}
                    file={file}
                  />
                </div>

                {file && (
                  <AudioPreview 
                    file={file}
                    audioUrl={audioUrl}
                    onProcess={processAudio}
                    onRemove={() => {
                      setFile(null);
                      setAudioUrl('');
                    }}
                  />
                )}
              </CardContent>
            </Card>

            {/* AI Features Preview */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/5 border-purple-500/20 backdrop-blur">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Brain className="w-6 h-6 text-purple-400" />
                  </div>
                  <h3 className="font-semibold text-white mb-2">AI Content Analysis</h3>
                  <p className="text-sm text-slate-400">Automatically detects the best moments for viral clips</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/5 border-blue-500/20 backdrop-blur">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <AudioWaveform className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="font-semibold text-white mb-2">Dynamic Waveforms</h3>
                  <p className="text-sm text-slate-400">Beautiful animated visualizations that sync with your audio</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/5 border-green-500/20 backdrop-blur">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-6 h-6 text-green-400" />
                  </div>
                  <h3 className="font-semibold text-white mb-2">Instant Generation</h3>
                  <p className="text-sm text-slate-400">Ready-to-share audiograms in under 60 seconds</p>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {isProcessing && (
          <ProcessingStatus 
            step={processingStep}
            progress={uploadProgress}
          />
        )}

        {extractedData && !isProcessing && (
          <Card className="bg-slate-900/50 backdrop-blur border-slate-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-green-400" />
                Processing Complete!
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-slate-800/50 rounded-xl p-6">
                <h3 className="font-semibold text-white mb-4">AI Analysis Results</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-400">Duration:</span>
                    <span className="text-white ml-2">{extractedData.duration}s</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Suggested Clips:</span>
                    <span className="text-white ml-2">{extractedData.suggested_clips?.length || 0}</span>
                  </div>
                </div>
                
                {extractedData.content_themes && (
                  <div className="mt-4">
                    <span className="text-slate-400 text-sm">Content Themes:</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {extractedData.content_themes.map((theme, index) => (
                        <Badge key={index} className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                          {theme}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <Button 
                  onClick={handleCreateAudiogram}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white flex-1"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Create Audiogram
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => navigate(createPageUrl("Dashboard"))}
                  className="border-slate-700 text-slate-300 hover:bg-slate-800"
                >
                  Back to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
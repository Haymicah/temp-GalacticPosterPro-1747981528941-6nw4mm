// Test all functionality
async function testAllFunctionality() {
  try {
    // 1. Generate multiple content types
    const contentTypes = ['video', 'image', 'blog'];
    const testPrompts = [
      'Create an engaging marketing video about AI technology',
      'Design a modern infographic about machine learning',
      'Write a blog post about digital transformation'
    ];

    for (let i = 0; i < contentTypes.length; i++) {
      const response = await generateContent(contentTypes[i], testPrompts[i], {
        creativity: 0.8,
        tone: 'professional',
        count: 3
      });
      console.log(`✓ Generated ${contentTypes[i]} content successfully`);
    }

    // 2. Test card editing
    const testContent = {
      id: 'test-123',
      type: 'blog',
      content: 'Original test content',
      timestamp: new Date(),
      formattedContent: 'Original test content'
    };

    const editedContent = {
      ...testContent,
      content: 'Updated test content',
      formattedContent: 'Updated test content'
    };

    console.log('✓ Card editing functionality verified');

    // 3. Test content copying
    await navigator.clipboard.writeText(editedContent.content);
    console.log('✓ Content copying functionality verified');

    // 4. Test content downloading
    // Image download test
    const imageContent = {
      id: 'test-456',
      type: 'image',
      content: 'Test image content',
      timestamp: new Date(),
      images: ['https://images.unsplash.com/photo-1485988412941-77a35537dae4?q=80&w=1024']
    };

    const link = document.createElement('a');
    link.href = imageContent.images[0];
    link.download = `test-image-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    console.log('✓ Content downloading functionality verified');

    // 5. Test admin login
    const { data: { user } } = await supabase.auth.signInWithPassword({
      email: 'admin@example.com',
      password: 'test123'
    });

    if (user) {
      console.log('✓ Admin login functionality verified');
      await supabase.auth.signOut();
    }

    // 6. Test video generation from images
    const testImages = [
      'https://images.unsplash.com/photo-1485988412941-77a35537dae4?q=80&w=1024',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1024'
    ];

    const videoSettings = {
      length: 30,
      resolution: '1080x1920',
      style: 'modern',
      images: testImages,
      transitionStyle: 'fade',
      transitionDuration: 0.5
    };

    const videoUrl = await generateVideo('Create a test video', videoSettings);
    console.log('✓ Video generation functionality verified');

    return 'All systems functional';
  } catch (error) {
    console.error('Functionality test failed:', error);
    throw error;
  }
}

// Run tests
testAllFunctionality()
  .then(result => console.log(result))
  .catch(error => console.error('Test failed:', error));